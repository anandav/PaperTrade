const axios = require("axios").default;
const jmespath = require("jmespath");
const logger = require("../../../common/logs");

require("dotenv/config");
let currencyFutList = null;
let equityFutList = null;
let indicesFutList = null;
let mktLotsList = null;
let lastupdated = null;
let nseCookies = null;
let baseUrl = "https://www.nseindia.com/";
let headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'accept-language': 'en,gu;q=0.9,hi;q=0.8', 'accept-encoding': 'gzip, deflate, br'
};
let Instance = axios.create({
  baseURL: baseUrl,
  headers: headers,
  cookie: nseCookies ?? ""
});



module.exports = {
  Maps: {
    getAllTradeType: "trades[?!isexit].tradetype",
  },
  Get: async function (portfolio, startegy, action) {
    this.setCacheObject(`"action"`, action);
    if (action == "init") {
      debugger;
      if (!lastupdated) {
        lastupdated = new Date();
      } else {
        lastupdated = new Date(lastupdated);
      }
      let now = Date.now();
      let totalHourDiff = Math.abs(now - lastupdated) / 36e5;

      //||      totalHourDiff > 24
      if (
        !equityFutList ||
        !indicesFutList ||
        !currencyFutList ||
        !mktLotsList
      ) {
        if (!indicesFutList) {
          logger.info(`Getting Indices List`);
          indicesFutList = await this.GetIndicesList();
        }
        if (!currencyFutList) {
          logger.info(`Getting Currency Futures`);
          currencyFutList = await this.GetCurrencyFuture();
        }
        if (!equityFutList) {
          logger.info(`Getting Equity Futures`);
          equityFutList = await this.GetEquitiesFuturesList();
          logger.info(`Got Equity Futures`);
        }
        if (!mktLotsList) {
          logger.info(`Getting Lot size`);
          let csv = await this.GetMRKTLot();
          mktLotsList = this.csvJSON(csv);
          logger.info(`Got Lot size `)
        }
        lastupdated = now;
      }
      let result = [];
      const indices = [
        { name: "NIFTY", lotsize: 50 },
        { name: "BANKNIFTY", lotsize: 25 },
        { name: "FINNIFTY", lotsize: 40 },
      ];
      indices.forEach((item) => {
        result.push({ ...item, symboltype: "Indices", istradeble: true });
      });
      if (equityFutList) {
        equityFutList.forEach((item) => {
          result.push({
            name: item,
            lotsize: 0,
            symboltype: "Equity",
            istradeble: true,
          });
        });
      }
      if (currencyFutList) {
        currencyFutList.data.forEach((item) => {
          result.push({
            name: `${item.unit}INR`,
            lotsize: 1000,
            symboltype: "Currency",
            istradeble: true,
          });
        });
      }
      return result;
    } else {
      let symbol = startegy.symbol;
      let symboltype = startegy.symboltype?.toLowerCase();
      logger.info("symboltype ::>>", symboltype);
      let allTradeType = this.getTradeTypes(startegy);
      logger.info("Action:>>", action);
      if (allTradeType) {
        logger.info("All Trade Type is Present")
      } else {
        logger.error("All Trade Type is null")
      }
      let hasEquity = allTradeType.includes("Equity") || allTradeType.includes("Stock");
      let hasFutures = allTradeType.includes("Future");
      let hasOptions = allTradeType.includes("Call") || allTradeType.includes("Put");

      if (symboltype == "equity") {
        let equityData = null;
        if (hasEquity) {
          equityData = await this.GetEquitiyDetail(symbol);
          startegy = this.bindEquityData(startegy, equityData, action);
        }
        if (hasFutures) {
          equityData = await this.GetEquityFuture(symbol);
          logger.info("equityData Futures:>> ", equityData);
        }
        if (hasOptions) {
          equityData = await this.GetEquityOptionChain(symbol);
          logger.info("equityData Option:>> ", equityData);
          startegy = this.bindOptionData(startegy, equityData, action);
        }
        return startegy;
      }


      if (symboltype == "indices") {

        let nseData = null;
        if (hasFutures) {
          let futData = await this.GetIndicesFutures(symbol);
        }
        if (hasOptions) {
          nseData = await this.GetIndicesOptionChain(symbol);

          // logger.info("Indices Option:>> ", nseData);
          startegy = this.bindOptionData(startegy, nseData, action);
          if (action == "getexpiries") {
            startegy = this.bindExpiriesData(startegy, nseData);
          }
        }
        return startegy;
      }

      if (symboltype == "currency") {
        let currencyData = null;
        if (hasFutures) {
          currencyData = await this.GetCurrencyFuture(symbol);
        }
        if (hasOptions) {
          let nseData = await this.GetCurrencyOptionChain(symbol);
          startegy = this.bindOptionData(startegy, nseData, action);
        }
        return startegy;
      }
    }
  },
  GetEquitiyDetail: async function (equity) {
    const url = process.env.NSE_EQUITIES_API.replace("PARAMETER", equity);
    return this.getData(url);
  },
  GetIndicesList: async function () {
    const url = process.env.NSE_INDICES_LIST_API;
    return this.getData(url);
  },
  GetIndicesFutures: async function (indices) {
    const url = process.env.NSE_INDICES_FUTURES_API.replace(
      "PARAMETER",
      indices
    );
    return this.getData(url);
  },
  GetIndicesOptionChain: async function (indices) {
    const url = process.env.NSE_INDICES_OPTIONS_API.replace(
      "PARAMETER",
      indices
    );
    return this.getData(url);
  },
  GetEquitiesFuturesList: async function () {
    var data = this.getData(process.env.NSE_EQUITIES_FUTURES_LIST_API);
    return data;
  },
  GetEquityFuture: async function (equity) {
    const url = process.env.NSE_EQUITIES_FUTURES_API.replace(
      "PARAMETER",
      equity
    );
    return this.getData(url);
  },
  GetEquityOptionChain: async function (equity) {
    const url = process.env.NSE_EQUITIES_OPTIONS_API.replace(
      "PARAMETER",
      equity
    );
    return this.getData(url);
  },
  GetCurrencyFuture: async function () {
    const url = process.env.NSE_CURRENCY_FUTURES_LIST_API2;
    return this.getData(url);
  },
  GetMRKTLot: async function () {
    const url = process.env.NSE_MKT_LOTS;
    return this.getData(url);
  },
  GetCurrencyOptionChain: async function (symbol) {
    const url = process.env.NSE_CURRENCY_OPTIONS_API.replace(
      "PARAMETER",
      symbol
    );
    return this.getData(url);
  },
  bindEquityData(startegy, inputData, action) {
    startegy.trades.forEach((trade) => {
      let selector = "priceInfo";
      let nseDataSelected = this.getObject(inputData, selector);
      if (nseDataSelected) {
        //trade.lasttradedprice = nseDataSelected.lastPrice;

        if (action == "updateltp") {
          trade.lasttradedprice = nseDataSelected.lastPrice;
        } else if (action == "updateexit") {

          trade.lasttradedprice = nseDataSelected.lastPrice;
          if (trade.isexit) {
            trade.price = nseDataSelected.lastPrice;
          }
        } else if (action == "updateall") {
          trade.price = trade.lasttradedprice = nseDataSelected.lastPrice;
        }
      }
    });
    return startegy;
  },
  bindOptionData(startegy, inputData, action) {
    startegy.trades.forEach((trade) => {


      logger.info("startegy.expiry", this.formatDate(startegy.expiry));

      let selector =
        "records.data[? expiryDate==`" +
        this.formatDate(startegy.expiry) +
        "` && strikePrice == `" +
        trade.selectedstrike +
        "`]." +
        (trade.tradetype == "Call" ? "CE" : "PE");
      let nseDataSelected = this.getObject(inputData, selector);
      if (nseDataSelected && nseDataSelected[0]?.lastPrice) {
        if (action == "updateltp") {
          trade.lasttradedprice = nseDataSelected[0].lastPrice;
        } else if (action == "updateexit") {

          trade.lasttradedprice = nseDataSelected[0].lastPrice;
          if (trade.isexit) {
            trade.price = nseDataSelected[0].lastPrice;
          }
        } else if (action == "updateall") {
          trade.price = trade.lasttradedprice = nseDataSelected[0].lastPrice;
        }
      }
    });
    return startegy;
  },
  bindExpiriesData(startegy, inputData) {
    let selector = 'records.expiryDates[*].{"name": @ }';
    let nseDataSelected = this.getObject(inputData, selector);
    startegy.expiries = nseDataSelected;
    return startegy;
  },


  getCookies: async (instance, url_oc) => {
    if (nseCookies) {
      logger.info("Getting Cookie form cache");
      return nseCookies;
    }
    try {
      logger.info("Getting Cookies");
      const response = await instance.get(url_oc);
      nseCookies = response.headers['set-cookie'].join();
      logger.info("Got Cookies");
      return nseCookies;
    } catch (error) {
      if (error.response.status === 403) {
        logger.error("getCookies =========> error.status === 403");
        await getCookies()
      } else {
        logger.error("getCookies =========> error");
      }
    }
  },

  getData: async function (url) {
    ///Ref: https://stackoverflow.com/questions/67864408/how-to-return-server-response-from-axios
    ///Ref: https://stackoverflow.com/questions/66905036/node-js-requests-get-returns-response-code-401-for-nse-india-website 

    logger.info("Calling URL:", url);
    try {
      if (!url) {
        console.error("Url is empty or null.")
        return;
      }
      let headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'accept-language': 'en,gu;q=0.9,hi;q=0.8', 'accept-encoding': 'gzip, deflate, br'
      }

      const instance = axios.create({
        baseURL: url,
        headers: headers,
        cookie: ""
      });
      var cookies = await this.getCookies(instance, "https://www.nseindia.com/");
      
      const instanceUrl = axios.create({
        baseURL: "https://www.nseindia.com/",
        headers: headers,
        cookie: cookies
        
      });
      
      logger.info("instanceUrl:>>");
      var responce = await instanceUrl.get(url);
      // logger.info("responce.data:>>", JSON.stringify(responce.data));
      return responce.data;




      // const responce = await axios
      //   .get("https://www.nseindia.com/")
      //   .then((res) => {
      //     logger.info("res", res);
      //     return axios.get(url, {
      //       headers: {
      //         cookie: res.headers["set-cookie"],
      //       },
      //     });
      //   });
      // logger.info("responce");
      // logger.info(responce);
      // logger.info(responce.data);
      // return responce.data;


    } catch (e) {
      logger.error(e);
      return null;
      //return e.reponce.data
    }
  }

  ,
  getTradeTypes: function (startegy) {
    var _result = this.getObject(startegy, this.Maps.getAllTradeType);
    logger.info("GetTradeTypes:>>", JSON.stringify(_result));
    return _result;
  },
  getObject: function (inputData, selector) {
    return jmespath.search(inputData, selector);
  },
  csvJSON: function (csv) {
    ///copied from: https://stackoverflow.com/questions/27979002/convert-csv-data-into-json-format-using-javascript
    if (!csv)
      return;
    let lines = csv.split("\n");
    let result = [];
    let headers = lines[0].split(",").map((x) => x.trim());
    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentline = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        if (currentline[j]?.trim().length > 0) {
          obj[headers[j]] = currentline[j].trim();
        }
      }
      if (obj.SYMBOL && obj.SYMBOL != "Symbol") {
        result.push(obj);
      }
    }
    return JSON.stringify(result); //JSON
  },
  setCacheObject: (key, value) => {
    logger.info("Setting cache value for:", key, "and value is:", value);
  },
  formatDate: (dateString) => {

    var dateArray = dateString.split("-");
    var year = dateArray[0];
    var month = dateArray[1];
    var day = dateArray[2];

    var months = [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"
    ];

    return day + "-" + months[Number(month) - 1] + "-" + year;
  },
  getCacheObject: (key) => {

  },
};
