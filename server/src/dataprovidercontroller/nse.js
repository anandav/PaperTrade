const axios = require("axios").default;
const jmespath = require("jmespath");
const logger = require("../common/logs");
const ttlCache = require("../common/ttlCache");

let currencyFutList = null;
let equityFutList = null;
let indicesFutList = null;
let mktLotsList = null;
let lastupdated = null;
let nseCookies = null;
let nseCookieFetchedAt = 0;
const NSE_HOME = "https://www.nseindia.com/";
const COOKIE_TTL_MS = 10 * 60 * 1000;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "sec-ch-ua":
    '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
};



module.exports = {
  Maps: {
    getAllTradeType: "trades[?!isexit].tradetype",
  },
  Get: async function (portfolio, startegy, action) {
    this.setCacheObject(`"action"`, action);
    if (action == "init") {
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
      let symbol = this.resolveSymbol(startegy);
      let symboltype = (startegy.symboltype || "").toLowerCase().trim();
      let allTradeType = this.getTradeTypes(startegy) || [];
      let hasEquity =
        allTradeType.includes("Equity") || allTradeType.includes("Stock");
      let hasFutures = allTradeType.includes("Future");
      let hasOptions =
        allTradeType.includes("Call") || allTradeType.includes("Put");

      logger.info("NSE quote request", {
        action,
        symboltype,
        symbol: symbol || "(empty)",
        strategyId: startegy?._id,
        strategyName: startegy?.name,
        tradeCount: Array.isArray(startegy?.trades) ? startegy.trades.length : 0,
        tradeTypes: allTradeType,
        hasEquity,
        hasFutures,
        hasOptions,
        expiry: startegy?.expiry || null,
      });

      if (!symbol) {
        logger.warn(
          "NSE skip: strategy has no symbol. Set Symbol Type and Symbol before refreshing LTP.",
          {
            action,
            symboltype,
            strategyId: startegy?._id,
            strategyName: startegy?.name,
          }
        );
        return startegy;
      }

      if (symboltype == "equity") {
        let equityData = null;
        if (hasEquity) {
          equityData = await this.GetEquitiyDetail(symbol);
          if (!equityData) {
            logger.warn("NSE equity quote returned no data", { symbol, action });
          }
          startegy = this.bindEquityData(startegy, equityData, action);
        }
        if (hasFutures) {
          equityData = await this.GetEquityFuture(symbol);
          logger.debug("equityData Futures:", equityData ? "present" : "null");
        }
        if (hasOptions) {
          equityData = await this.GetEquityOptionChain(symbol);
          logger.debug("equityData Option:", equityData ? "present" : "null");
          startegy = this.bindOptionData(startegy, equityData, action);
        }
        return startegy;
      }

      if (symboltype == "indices") {
        let nseData = null;
        if (hasFutures) {
          await this.GetIndicesFutures(symbol);
        }
        if (hasOptions) {
          nseData = await this.GetIndicesOptionChain(
            symbol,
            this.formatDate(startegy.expiry)
          );
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

      logger.warn("NSE skip: unsupported symboltype", {
        symboltype,
        symbol,
        action,
      });
      return startegy;
    }
  },
  resolveSymbol: function (startegy) {
    const direct = (startegy?.symbol || "").toString().trim();
    if (direct) {
      return direct;
    }
    const trades = Array.isArray(startegy?.trades) ? startegy.trades : [];
    for (const trade of trades) {
      if (trade?.isexit) {
        continue;
      }
      const fromTrade = (trade.symbol || "").toString().trim();
      if (fromTrade) {
        logger.info("NSE symbol resolved from trade", {
          symbol: fromTrade,
          tradetype: trade.tradetype,
          tradeId: trade._id,
        });
        return fromTrade;
      }
    }
    return "";
  },
  buildNseUrl: function (template, equity) {
    if (!template) {
      logger.error("NSE URL template missing from config");
      return null;
    }
    if (!equity || !String(equity).trim()) {
      logger.error("NSE URL build skipped: empty symbol parameter", {
        template,
      });
      return null;
    }
    const encoded = encodeURIComponent(String(equity).trim().toUpperCase());
    return template.replace("PARAMETER", encoded);
  },
  GetEquitiyDetail: async function (equity) {
    const symbol = String(equity || "").trim().toUpperCase();
    if (!symbol) {
      logger.error("GetEquitiyDetail skipped: empty equity symbol");
      return null;
    }
    const url = this.buildNseUrl(global.appConfig.nseEquitiesApi, symbol);
    const raw = await this.getData(url, {
      referer: `https://www.nseindia.com/get-quotes/equity?symbol=${encodeURIComponent(symbol)}`,
      warmPath: `/get-quotes/equity?symbol=${encodeURIComponent(symbol)}`,
    });
    return this.normalizeEquityQuote(raw, symbol);
  },
  normalizeEquityQuote: function (data, symbol) {
    if (!data) {
      return null;
    }
    if (data.priceInfo && data.priceInfo.lastPrice != null) {
      return data;
    }
    const row = Array.isArray(data.equityResponse)
      ? data.equityResponse[0]
      : null;
    if (!row) {
      logger.warn("NSE equity quote: unexpected payload shape", {
        symbol,
        keys: Object.keys(data),
      });
      return data;
    }
    const lastPrice =
      row.orderBook?.lastPrice ??
      row.tradeInfo?.lastPrice ??
      row.metaData?.closePrice ??
      row.metaData?.previousClose ??
      row.priceInfo?.lastPrice;
    if (lastPrice == null || Number.isNaN(Number(lastPrice))) {
      logger.warn("NSE equity quote: lastPrice missing in NextApi payload", {
        symbol,
        hasOrderBook: !!row.orderBook,
        hasTradeInfo: !!row.tradeInfo,
      });
    } else {
      logger.info("NSE equity quote ok", {
        symbol,
        lastPrice: Number(lastPrice),
        company: row.metaData?.companyName,
      });
    }
    return {
      ...data,
      priceInfo: {
        ...(row.priceInfo || {}),
        lastPrice: lastPrice != null ? Number(lastPrice) : null,
        open: row.metaData?.open,
        previousClose: row.metaData?.previousClose,
        close: row.metaData?.closePrice,
        dayHigh: row.metaData?.dayHigh,
        dayLow: row.metaData?.dayLow,
      },
      info: row.metaData || { symbol },
    };
  },
  GetIndicesList: async function () {
    const url = global.appConfig.nseIndicesListApi;
    return this.getData(url);
  },
  GetIndicesFutures: async function (indices) {
    const url = this.buildNseUrl(global.appConfig.nseIndicesFuturesApi, indices);
    return this.getData(url);
  },
  GetIndicesOptionChain: async function (indices, date) {
    const base = this.buildNseUrl(
      global.appConfig.nseIndicesOptionsApi,
      indices
    );
    if (!base) {
      return null;
    }
    const url = base.replace("DATE", date ?? "");
    return this.getData(url);
  },
  GetEquitiesFuturesList: async function () {
    return this.getData(global.appConfig.nseEquitiesFuturesListApi);
  },
  GetEquityFuture: async function (equity) {
    const url = this.buildNseUrl(
      global.appConfig.nseEquitiesFuturesApi,
      equity
    );
    return this.getData(url);
  },
  GetEquityOptionChain: async function (equity) {
    const url = this.buildNseUrl(
      global.appConfig.nseEquitiesOptionsApi,
      equity
    );
    return this.getData(url);
  },
  GetCurrencyFuture: async function () {
    const url = global.appConfig.nseCurrencyFuturesListApi2;
    return this.getData(url);
  },
  GetMRKTLot: async function () {
    const url = global.appConfig.nseMktLots;
    return this.getData(url);
  },
  GetCurrencyOptionChain: async function (symbol) {
    const url = this.buildNseUrl(
      global.appConfig.nseCurrencyOptionsApi,
      symbol
    );
    return this.getData(url);
  },
  bindEquityData(startegy, inputData, action) {
    if (!inputData) {
      logger.warn("bindEquityData skipped: no NSE payload");
      return startegy;
    }
    startegy.trades.forEach((trade) => {
      let selector = "priceInfo";
      let nseDataSelected = this.getObject(inputData, selector);
      if (nseDataSelected) {
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
      } else {
        logger.debug("bindEquityData: priceInfo missing for trade", {
          tradeId: trade._id,
          tradetype: trade.tradetype,
        });
      }
    });
    return startegy;
  },
  bindOptionData(startegy, inputData, action) {
    if (!inputData) {
      logger.warn("bindOptionData skipped: no NSE payload", {
        strategyId: startegy?._id,
        symbol: startegy?.symbol,
      });
      return startegy;
    }
    startegy.trades.forEach((trade) => {
      logger.debug("bindOptionData", {
        expiryRaw: startegy.expiry,
        expiryFormatted: this.formatDate(startegy.expiry),
        strike: trade.selectedstrike,
        tradetype: trade.tradetype,
      });
      let selector =
        "records.data[? expiryDates==`" +
        this.formatDate(startegy.expiry) +
        "` && strikePrice == `" +
        trade.selectedstrike +
        "`]." +
        (trade.tradetype == "Call" ? "CE" : "PE");
      logger.debug("JMESPath selector:", selector);
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


  parseSetCookieHeader: function (setCookie) {
    if (!setCookie || !setCookie.length) {
      return "";
    }
    return setCookie
      .map((c) => String(c).split(";")[0].trim())
      .filter(Boolean)
      .join("; ");
  },

  mergeCookies: function (existing, setCookie) {
    const map = {};
    String(existing || "")
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((pair) => {
        const i = pair.indexOf("=");
        if (i > 0) {
          map[pair.slice(0, i)] = pair.slice(i + 1);
        }
      });
    this.parseSetCookieHeader(setCookie)
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((pair) => {
        const i = pair.indexOf("=");
        if (i > 0) {
          map[pair.slice(0, i)] = pair.slice(i + 1);
        }
      });
    return Object.keys(map)
      .map((k) => `${k}=${map[k]}`)
      .join("; ");
  },

  ensureNseSession: async function (warmPath) {
    const now = Date.now();
    if (nseCookies && now - nseCookieFetchedAt < COOKIE_TTL_MS) {
      logger.debug("NSE session: using cached cookies");
      return nseCookies;
    }
    try {
      logger.info("NSE session: warming home page");
      const home = await axios.get(NSE_HOME, {
        timeout: 20000,
        headers: {
          ...BROWSER_HEADERS,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        },
        validateStatus: () => true,
        maxRedirects: 5,
      });
      logger.info("NSE session home status", {
        status: home.status,
        cookieCount: (home.headers["set-cookie"] || []).length,
      });
      let cookie = this.parseSetCookieHeader(home.headers["set-cookie"]);

      if (warmPath) {
        const warmUrl = warmPath.startsWith("http")
          ? warmPath
          : `https://www.nseindia.com${warmPath}`;
        logger.info("NSE session: warming quote page", { warmUrl });
        const warm = await axios.get(warmUrl, {
          timeout: 20000,
          headers: {
            ...BROWSER_HEADERS,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            Referer: NSE_HOME,
            Cookie: cookie,
            "Sec-Fetch-Site": "same-origin",
          },
          validateStatus: () => true,
          maxRedirects: 5,
        });
        cookie = this.mergeCookies(cookie, warm.headers["set-cookie"]);
        logger.info("NSE session warm status", {
          status: warm.status,
          cookieCount: cookie ? cookie.split(";").length : 0,
        });
      }

      if (!cookie) {
        logger.warn("NSE session: no usable cookies after warm-up");
        return null;
      }
      nseCookies = cookie;
      nseCookieFetchedAt = now;
      logger.info("NSE session: cookies ready", {
        names: cookie
          .split(";")
          .map((p) => p.split("=")[0].trim())
          .filter(Boolean),
      });
      return nseCookies;
    } catch (error) {
      logger.error("NSE session warm-up failed", {
        status: error?.response?.status,
        message: error?.message,
      });
      return null;
    }
  },

  getData: async function (url, options) {
    if (!url) {
      logger.error("NSE getData skipped: url is empty or null");
      return null;
    }
    if (/symbol=$|symbol=&/.test(url) || url.includes("symbol=%20")) {
      logger.error("NSE getData skipped: empty symbol in url", { url });
      return null;
    }

    const self = this;
    return ttlCache.getOrFetch(url, async () => {
      logger.info("NSE fetch:", url);
      return self.fetchFromNse(url, false, options || {});
    });
  },

  fetchFromNse: async function (url, retried, options) {
    options = options || {};
    try {
      const cookies = await this.ensureNseSession(options.warmPath);
      const headers = {
        ...BROWSER_HEADERS,
        Accept: "application/json, text/plain, */*",
        Referer: options.referer || NSE_HOME,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "X-Requested-With": "XMLHttpRequest",
      };
      if (cookies) {
        headers.Cookie = cookies;
      }

      const response = await axios.get(url, {
        timeout: 20000,
        headers,
        validateStatus: () => true,
        maxRedirects: 5,
      });

      if (response.headers["set-cookie"]) {
        nseCookies = this.mergeCookies(
          nseCookies,
          response.headers["set-cookie"]
        );
        nseCookieFetchedAt = Date.now();
      }

      if (response.status >= 200 && response.status < 300) {
        logger.debug("NSE fetch ok", {
          url,
          status: response.status,
          hasData: !!response.data,
        });
        return response.data;
      }

      logger.error("NSE fetch failed", {
        url,
        status: response.status,
        retried: !!retried,
        data:
          typeof response.data === "string"
            ? response.data.slice(0, 220)
            : response.data,
      });

      if (response.status === 403 && !retried) {
        logger.warn("NSE 403, clearing session and retrying once", { url });
        nseCookies = null;
        nseCookieFetchedAt = 0;
        return this.fetchFromNse(url, true, options);
      }
      return null;
    } catch (e) {
      logger.error("NSE fetch exception", {
        url,
        status: e?.response?.status,
        message: e?.message,
        retried: !!retried,
      });
      if (e?.response?.status === 403 && !retried) {
        nseCookies = null;
        nseCookieFetchedAt = 0;
        return this.fetchFromNse(url, true, options);
      }
      return null;
    }
  },
  getTradeTypes: function (startegy) {
    var _result = this.getObject(startegy, this.Maps.getAllTradeType);
    logger.debug("GetTradeTypes:", _result);
    return Array.isArray(_result) ? _result : [];
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
  GetLastThursdayOfMonth: (year, month) => {
    if (!year) {
      var _curretDate = new Date();
      year = _curretDate.getFullYear();
      month = _curretDate.getMonth() + 1;
    }
    var lastDay = new Date(year, month, 0);
    if (lastDay.getDay() < 4) {
      lastDay.setDate(lastDay.getDate() - 6);
    }
    lastDay.setDate(lastDay.getDate() - (lastDay.getDay() - 4));
    return lastDay;
  },
  formatDate: (dateString) => {
    logger.info("dateString:>>", dateString);
    if (!dateString) {
      dateString = this.GetLastThursdayOfMonth(null, null);
    }
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
