const axios = require('axios').default;
// const axiosCookieJarSupport = require('axios-cookiejar-support').default;
// const tough = require('tough-cookie');
require("dotenv/config");


module.exports = {
    GetAllIndices: async function () {
        return [
            { "name": "NIFTY" },
            { "name": "BANKNIFTY" },
            { "name": "FINNIFTY" },
        ];
    },
    GetIndicesOptionChain: async function (indices) {
        const url = process.env.NSE_INDICES_OPTIONS_API.replace('PARAMETER', indices); 
        return this.getData(url);
    },
    GetEquityOptionChain: async function (equity) {
        const url = process.env.NSE_EQUITIES_API.replace('PARAMETER', equity); 
        return this.getData(url);
    },
    GetEquitiesList: async function () {
        return this.getData(process.env.NSE_EQUITIES_LIST_API);
    },
    GetCurrencyOptionChain: async function (symbol) {
        const url = process.env.NSE_CURRENCY_API.replace('PARAMETER', symbol);
        return this.getData(url);
    },
    getData: async function (url) {
        ///ref // https://stackoverflow.com/questions/67864408/how-to-return-server-response-from-axios
        console.log('url :>> ', url);
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

