const axios = require('axios').default;
require("dotenv/config");
let currencyFutList = undefined;
let equityFutList = undefined;
let indicesFutList = undefined;
module.exports = {
    Get: async function (segment, symbol) {
        if (segment == "list" && symbol == "all") {
            if (!equityFutList || !indicesFutList || !currencyFutList) 
            {
                indicesFutList = await this.GetIndicesList();
                currencyFutList = await this.GetCurrencyFuture();
                equityFutList = await this.GetEquitiesFuturesList();
            }
            let result = [];
            equityFutList.forEach(item => {
                result.push({ "symbol": item, "type": "equity", istradeble: true });
            });
            const indices = ["NIFTY", "BANKNIFTY", "FINNIFTY"]
            indices.forEach(item => {
                result.push({ "symbol": item, "type": "indices", istradeble: true });
            });
            currencyFutList.data.forEach(item => {
                result.push({ "symbol": `${item.unit}INR`, "type": "currency", istradeble: true });
            });
            return result;
        } else if (segment == "equity") {
            return await this.GetEquitiyDetail(symbol);
        } else if (segment == "equityfutureslist") {
            return await this.GetEquitiesFuturesList();
        } else if (segment == "equityfutures") {
            return await this.GetEquityFuture(symbol);
        } else if (segment == "equityoptionschain") {
            return await this.GetEquityOptionChain(symbol);
        } else if (segment == "currencyfutures") {
            return await this.GetCurrencyFuture();
        } else if (segment == "currencyoptions") {
            return await this.GetCurrencyOptionChain(symbol);
        } else if (segment == "indiceslist") {
            return await this.GetIndicesList();
        } else if (segment == "indicesfutures") {
            return await this.GetIndicesFutures(symbol);
        } else if (segment == "indicesoptions") {
            return await this.GetIndicesOptionChain(symbol);
        } else {
            return { "error": "Invalid segment." };
        }
    },

    GetEquitiyDetail: async function (equity) {
        const url = process.env.NSE_EQUITIES_API.replace('PARAMETER', equity);
        return this.getData(url);
    },
    GetIndicesList: async function () {
        const url = process.env.NSE_INDICES_LIST_API;
        return this.getData(url);
    },
    GetIndicesFutures: async function (indices) {
        const url = process.env.NSE_INDICES_FUTURES_API.replace('PARAMETER', indices);
        return this.getData(url);
    },
    GetIndicesOptionChain: async function (indices) {
        const url = process.env.NSE_INDICES_OPTIONS_API.replace('PARAMETER', indices);
        return this.getData(url);
    },
    GetEquitiesFuturesList: async function () {
        return this.getData(process.env.NSE_EQUITIES_FUTURES_LIST_API);
    },
    GetEquityFuture: async function (equity) {
        const url = process.env.NSE_EQUITIES_FUTURES_API.replace('PARAMETER', equity);
        return this.getData(url);
    },
    GetEquityOptionChain: async function (equity) {
        const url = process.env.NSE_EQUITIES_OPTIONS_API.replace('PARAMETER', equity);
        return this.getData(url);
    },

    GetCurrencyFuture: async function () {
        const url = process.env.NSE_CURRENCY_FUTURES_LIST_API2;
        return this.getData(url);
    },

    GetCurrencyOptionChain: async function (symbol) {
        const url = process.env.NSE_CURRENCY_OPTIONS_API.replace('PARAMETER', symbol);
        return this.getData(url);
    },
    getData: async function (url) {
        ///Ref: https://stackoverflow.com/questions/67864408/how-to-return-server-response-from-axios
        try {
            const responce = await axios.get('https://www.nseindia.com/')
                .then(res => {
                    return axios.get(url, {
                        headers: {
                            cookie: res.headers['set-cookie']
                        }
                    })
                });
            return responce.data;
        } catch (e) {
            return null;
            //return e.reponce.data
        }
    }
}

