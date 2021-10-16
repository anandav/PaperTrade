const axios = require('axios').default;

module.exports = {
    GetIndicesOptionChain: async function (indices) {
        const url =  'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY';
        return url;
    },
    GetEquityOptionChain: async function (equity) {

    },
    GetFnOEquityList: async function (equity) {

    },
    GetCurrencyOptionChain : async function (indices) {

    },
    getData: async function (url) {
        axios.get('https://www.nseindia.com/option-chain')
            .then(res => {
                return axios.get(url, {
                    headers: {
                        cookie: res.headers['set-cookie'] // cookie is returned as a header
                    }
                })
            })
            .then(res2 => {
                console.log(res2.data);
                return res2.data;
            })
            .catch(res => console.error(res.response.data))
    }
}

