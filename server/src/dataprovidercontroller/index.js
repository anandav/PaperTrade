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
    const SymbolTypes = [
        { "name": "Equity", "value": 1024 },
        { "name": "Indices", "value": 2048 },
        { "name": "Currency", "value": 4096 },
        { "name": "Crypto", "value": 8192 },
        { "name": "Commodity", "value": 16384 }];

    const result = {
        Action,
        SymbolTypes,
        "Symbols": {},
        "Exchanges": [
            { "name": "NSE",    "isactive": true,   "description": "National Stock Exchange.", "segmentendpoints": 22569 },
            { "name": "CBOE",   "isactive": true,   "description": "Chicago Board Options Exchange.", "segmentendpoints": 2051 },
            { "name": "BSE",    "isactive": false,  "description": "Bombay Stock Exchange.", "segmentendpoints": 0 },
            { "name": "MCX",    "isactive": false,  "description": "Multi Commodity Exchange.", "segmentendpoints": 0 },
            { "name": "WAZIRX", "isactive": false,  "description": "Crypto Exchange.", "segmentendpoints": 16387 }]
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
        result.ExchangeDetail = await getExchangeDetail();
        result.Symbols = await nse.Get(portfolio, startegy, action);
        return result;
    }

    if (portfolio?.exchange?.toLowerCase() == "nse") {
        result = await nse.Get(portfolio, startegy, action);
    } else {
        result = { "error": "Not a valid request." };
    }

    return result;



}

module.exports = dataprovider;