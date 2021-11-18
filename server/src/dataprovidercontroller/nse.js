const axios = require('axios').default;
const jmespath = require('jmespath');
require("dotenv/config");
let currencyFutList = undefined;
let equityFutList = undefined;
let indicesFutList = undefined;
module.exports = {
    Maps: {
        getAllTradeType: "trades[?!isexit].tradetype"


    },
    Get: async function (portfolio, startegy, action) {
        ///
        ///
        ///This is POC code and its data has to be moved to DB 
        ///
        ///
        ///


        if (action == "List") {
            if (!equityFutList || !indicesFutList || !currencyFutList) {
                indicesFutList = await this.GetIndicesList();
                currencyFutList = await this.GetCurrencyFuture();
                equityFutList = await this.GetEquitiesFuturesList();
            }
            let result = [];
            equityFutList.forEach(item => {
                result.push({ "symbol": item, "lotsize": 0, "symboltype": "equity", istradeble: true });
            });
            const indices = [{ "symbol": "NIFTY", "lotsize": 50 }, { "symbol": "BANKNIFTY", "lotsize": 25 }, { "symbol": "FINNIFTY", "lotsize": 40 }]
            indices.forEach(item => {
                result.push({ ...item, "symboltype": "indices", istradeble: true });
            });
            currencyFutList.data.forEach(item => {
                result.push({ "symbol": `${item.unit}INR`, "lotsize": 1000, "symboltype": "currency", istradeble: true });
            });
            return result;
        } else {
            let symbol = startegy.symbol;
            let allTradeType = this.getTradeTypes(startegy);
            let hasEquity = allTradeType.includes("Equity");
            let hasFutures = allTradeType.includes("Future");
            let hasOptions = allTradeType.includes("Call") || allTradeType.includes("Put");

            if (startegy.symboltype == "equity") {
                console.log('startegy.symboltype :>> ', startegy.symboltype);
                if (hasEquity) {
                    await this.GetEquitiyDetail(symbol);
                }
                if (hasFutures) {
                    await this.GetEquityFuture(symbol);
                }
                if (hasOptions) {
                    await this.GetEquityOptionChain(symbol);
                }
            }
            if (startegy.symboltype == "indices") {

                if (hasFutures) {
                    console.log('hasfut');
                    let indfut = await this.GetIndicesFutures(symbol);
                    console.log('indfut :>> ', indfut);
                }
                if (hasOptions) {
                    console.log('hasoption');
                    let indoption = await this.GetIndicesOptionChain(symbol);
                    //console.log('indoption :>> ', indoption);
                }
            }
            if (startegy.symboltype == "currency") {
                if (hasFutures) {
                    await this.GetCurrencyFuture(symbol);
                }
                if (hasOptions) {
                    await this.GetCurrencyOptionChain(symbol);
                }
            }

            // console.log('hasEquity :>> ', hasEquity);
            // console.log('hasOptions :>> ', hasOptions);
            // console.log('hasFutures :>> ', hasFutures);
        }


        // if (action == "List") {
        //     if (!equityFutList || !indicesFutList || !currencyFutList) {
        //         indicesFutList = await this.GetIndicesList();
        //         currencyFutList = await this.GetCurrencyFuture();
        //         equityFutList = await this.GetEquitiesFuturesList();
        //     }
        //     let result = [];
        //     equityFutList.forEach(item => {
        //         result.push({ "symbol": item, "symboltype": "equity", istradeble: true });
        //     });
        //     const indices = ["NIFTY", "BANKNIFTY", "FINNIFTY"]
        //     indices.forEach(item => {
        //         result.push({ "symbol": item, "symboltype": "indices", istradeble: true });
        //     });
        //     currencyFutList.data.forEach(item => {
        //         result.push({ "symbol": `${item.unit}INR`, "symboltype": "currency", istradeble: true });
        //     });
        //     return result;
        // } else if (action == "equity") {
        //     return await this.GetEquitiyDetail(symbol);
        // } 
        // // else if (action == "equityfutureslist") {
        // //    // return await this.GetEquitiesFuturesList();
        // // }
        //  else if (action == "equityfutures") {
        //     return await this.GetEquityFuture(symbol);
        // } else if (action == "equityoptionschain") {
        //     return await this.GetEquityOptionChain(symbol);
        // } else if (action == "currencyfutures") {
        //     return await this.GetCurrencyFuture();
        // } else if (action == "currencyoptions") {
        //     return await this.GetCurrencyOptionChain(symbol);
        // } 
        // // else if (action == "indiceslist") {
        // //     //return await this.GetIndicesList();
        // // }
        //  else if (action == "indicesfutures") {
        //     return await this.GetIndicesFutures(symbol);
        // } else if (action == "indicesoptions") {
        //     return await this.GetIndicesOptionChain(symbol);
        // } else {
        //     return { "error": "Invalid segment." };
        // }
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
    },
    getTradeTypes: function (strategy) {
        return this.getObject(strategy, this.Maps.getAllTradeType);
    },
    getObject: function (input, selector) {
        return jmespath.search(input, selector);
    },
}

