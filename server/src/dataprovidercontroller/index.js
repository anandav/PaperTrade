const express = require("express");
const dataprovider = express.Router();
const nse = require("./nse");
const cboe = require("./cboe");

dataprovider.get("/", async (req, res) => {
    res.json(getExchangeDetail());
});
dataprovider.post("/", async (req, res) => {
    var result = await get(req);
    res.json(result);
});


function getExchangeDetail() {
///
///
///This is POC code and its data has to be moved to DB 
///
///
///




    const Action = { "list": 1, "details": 2,};
    // "Future": 4, "Option": 8 
    const Types = { "all": 512, "equity": 1024, "indices": 2048, "currency": 4096, "crypto": 8192, "commodity": 16384 };

    const result = {
        Action,
        Types,
        "Exchanges": [
            { "exchange": "NSE", "isactive": true, "name": "National Stock Exchange.", "segmentendpoints": 22569 },
            { "exchange": "CBOE", "isactive": true, "name": "Chicago Board Options Exchange.", "segmentendpoints": 2051 },
            { "exchange": "BSE", "isactive": false, "name": "Bombay Stock Exchange.", "segmentendpoints": 0 },
            { "exchange": "MCX", "isactive": false, "name": "Multi Commodity Exchange.", "segmentendpoints": 0 },
            { "exchange": "WAZIRX", "isactive": false, "name": "Crypto Exchange.", "segmentendpoints": 16387 }]
    };
    // const result = [
    //     { "exchange": "NSE", "isactive": true, "name": "National Stock Exchange.", "segmentendpoints":  { 1: "equity", 2: "equityfutureslist", 4: "equityfutures", 8: "equityoptionschain", 16: "currencyfutures", 32: "currencyoptions", 64: "indiceslist", 128: "indicesfutures", 256: "indicesoptions" } },
    //     { "exchange": "CBOE", "isactive": true, "name": "Chicago Board Options Exchange.", "segmentendpoints": { 1: "listoption", 2: "options" } },
    //     { "exchange": "BSE", "isactive": false, "name": "Bombay Stock Exchange.", "segmentendpoints": { 1: "equity", 2: "currencyfutures", 4: "currencyoptions" } },
    //     { "exchange": "MCX", "isactive": false, "name": "Multi Commodity Exchange.", "segmentendpoints": { 1: "futures" } },
    //     { "exchange": "WAZIRX", "isactive": false, "name": "Crypto Exchange.", "segmentendpoints": { 1: "crypto" } }
    // ];
    return result;
}


async function get(req) {
    var body = req.body;
    var portfolio = body.portfolio;
    var startegy = body.strategy
    var action = body.action;
    if (portfolio.exchange?.toLowerCase() == "nse") {
        return await nse.Get(portfolio, startegy, action);
    } else {

        return { "error": "Not a valid request." };
    }
}

module.exports = dataprovider;