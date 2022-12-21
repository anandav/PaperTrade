const axios = require("axios").default;
const jmespath = require("jmespath");

const logger = require("../../../common/logs");

require("dotenv/config");
let currencyFutList = null;
let equityFutList = null;
let indicesFutList = null;
let mktLotsList = null;
let lastupdated = null;

module.exports = {
  Maps: {
    getAllTradeType: "trades[?!isexit].tradetype",
  },
  Get: async function (portfolio, startegy, action) {
    this.setCacheObject('action', action);
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
          indicesFutList = await this.GetIndicesList();
        }
        if (!currencyFutList) {
          currencyFutList = await this.GetCurrencyFuture();
        }
        if (!equityFutList) {
          equityFutList = await this.GetEquitiesFuturesList();
        }
        if (!mktLotsList) {
          let csv = await this.GetMRKTLot();
          mktLotsList = this.csvJSON(csv);
        }
        lastupdated = now;
      } else {

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

        //console.log('equityFutList :>> ', equityFutList);
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
      let allTradeType = this.getTradeTypes(startegy);
      logger.info("Action:>>", action);
      if(allTradeType){
        logger.info("All Trade Type is Present")
      }else{
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
          console.log("equityData Futures:>> ", equityData);
        }
        if (hasOptions) {
          equityData = await this.GetEquityOptionChain(symbol);
          console.log("equityData Option:>> ", equityData);
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
    logger.info(data);
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
      let selector =
        "records.data[? expiryDate==`" +
        startegy.expiry +
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
  getData: async function (url) {
    ///Ref: https://stackoverflow.com/questions/67864408/how-to-return-server-response-from-axios
    logger.info("Calling URL:", url);
    try {
      if (!url) {
        console.error("Url is empty or null.")
        return;
      }
      const responce = await axios
        .get("https://www.nseindia.com/")
        .then((res) => {
          return axios.get(url, {
            headers: {
              cookie: res.headers["set-cookie"],
            },
          });
        });
      return responce.data;
    } catch (e) {
      console.log(e);
      return null;
      //return e.reponce.data
    }
  },
  getTradeTypes: function (startegy) {
    var _result =  this.getObject(startegy, this.Maps.getAllTradeType);
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
  getCacheObject: (key) => {

  },
};
