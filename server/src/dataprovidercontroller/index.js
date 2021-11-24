const express = require("express");
const dataprovider = express.Router();
const nse = require("./nse");
const cboe = require("./cboe");

// dataprovider.get("/", async (req, res) => {
//     res.json(getExchangeDetail());
// });
dataprovider.post("/", async (req, res) => {
    var result = await get(req);
    res.json(result);
});


async function getExchangeDetail() {

    const Action = { "list": 1, "details": 2, };
    // "Future": 4, "Option": 8 
    const Types = { "equity": 1024, "indices": 2048, "currency": 4096, "crypto": 8192, "commodity": 16384 };

    const result = {
        Action,
        Types,
        "Symbols": {},
        "Exchanges": [
            { "exchange": "NSE", "isactive": true, "name": "National Stock Exchange.", "segmentendpoints": 22569 },
            { "exchange": "CBOE", "isactive": true, "name": "Chicago Board Options Exchange.", "segmentendpoints": 2051 },
            { "exchange": "BSE", "isactive": false, "name": "Bombay Stock Exchange.", "segmentendpoints": 0 },
            { "exchange": "MCX", "isactive": false, "name": "Multi Commodity Exchange.", "segmentendpoints": 0 },
            { "exchange": "WAZIRX", "isactive": false, "name": "Crypto Exchange.", "segmentendpoints": 16387 }]
    };

    return result;
}


async function get(req) {
    var result = {};
    var body = req.body;
    var portfolio = body.portfolio;
    var startegy = body.strategy
    var action = body.action;
    var initResult = {};
    if (action == "init") {
        result.ExchangeDetail = await  getExchangeDetail();
        result.Symbols = await nse.Get(portfolio, startegy, action);
        return result;
    }

    if (portfolio?.exchange?.toLowerCase() == "nse") {
        result =  await nse.Get(portfolio, startegy, action);
    } else {
        result = { "error": "Not a valid request." };
    }

    return result;



}

module.exports = dataprovider;