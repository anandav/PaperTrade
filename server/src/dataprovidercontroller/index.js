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
    const result = [
        { "exchange": "NSE", "isactive": true, "name": "National Stock Exchange.", "segmentendpoints": { 1: "equity", 2: "equityfutureslist", 4: "equityfutures", 8: "equityoptionschain", 16: "currencyfutures", 32: "currencyoptions", 64: "indiceslist", 128: "indicesfutures", 256: "indicesoptions" } },
        { "exchange": "CBOE", "isactive": true, "name": "Chicago Board Options Exchange.", "segmentendpoints": { 1: "listoption", 2: "options" } },
        { "exchange": "BSE", "isactive": false, "name": "Bombay Stock Exchange.", "segmentendpoints": { 1: "equity", 2: "currencyfutures", 4: "currencyoptions" } },
        { "exchange": "MCX", "isactive": false, "name": "Multi Commodity Exchange.", "segmentendpoints": { 1: "futures" } },
        { "exchange": "WAZIRX", "isactive": false, "name": "Crypto Exchange.", "segmentendpoints": { 1: "crypto" } }
    ];
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