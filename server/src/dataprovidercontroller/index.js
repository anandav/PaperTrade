const express = require("express");
const dataprovider = express.Router();
const nse = require("./nse");
const cboe = require("./cboe");

dataprovider.get("/", async (req, res) => {
    res.json(getExchangeDetail());
});
dataprovider.get("/:exchange", async (req, res) => {
    return get(req, res);
});
dataprovider.get("/:exchange/:segment", async (req, res) => {
    return get(req, res);
});
dataprovider.get("/:exchange/:segment/:symbol", async (req, res) => {
    return get(req, res);
});

function getExchangeDetail() {

    /// THIS IS CSV FOR SEGMENTENDPOINT option,
    /// NSE,,1024,2048,4096,8192,16384,
    /// ,,Stock,Indices,Currency,Coin,Commodity,
    /// 1,List,0,0,0,0,0,
    /// 2,Detail,0,0,0,0,0,
    /// 4,Future,0,0,0,0,0,
    /// 8,Option,0,0,0,0,0,
    /// 16,-,,,,,,
    /// 32,-,,,,,,
    /// 64,-,,,,,,
    /// 128,-,,,,,,
    /// 256,-,,,,,,
    /// 512,-,,,,,,segmentendpoints
    /// ,SUM,0,0,0,0,0,0





    const Features = { "List": 1, "Details": 2, "Future": 3, "Option": 4 };
    const Segments = { "Stock": 1024, "Indices": 2048, "Currency": 4096, "Crypto": 8192, "Commodity": 16384 };


    const result = {
        Features,
        Segments,
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


async function get(req, res) {
    const exchange = req.params?.exchange?.toLowerCase();
    const segment = req.params?.segment?.toLowerCase();
    const symbol = req.params?.symbol || null;
    if (exchange == "nse") {
        res.json(await nse.Get(segment, symbol));
    } else {
        res.json({ "error": "Not a valid request." });
    }
}

module.exports = dataprovider;