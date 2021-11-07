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
        { "exchange": "NSE", "isactive": true, "name": "National Stock Exchange.", "segmentendpoints": ["equity", "equityfutureslist", "equityfutures", "equityoptionschain", "currencyfutures", "currencyoptions", "indiceslist", "indicesfutures", "indicesoptions"] },
        { "exchange": "CBOE", "isactive": true, "name": "Chicago Board Options Exchange.", "segmentendpoints": ["options"] },
        { "exchange": "BSE", "isactive": false, "name": "Bombay Stock Exchange.", "segmentendpoints": ["equity", "currencyfutures", "currencyoptions"] },
        { "exchange": "MCX", "isactive": false, "name": "Multi Commodity Exchange.", "segmentendpoints": ["futures"] },
        { "exchange": "WAZIRX", "isactive": false, "name": "Crypto Exchange.", "segmentendpoints": ["crypto"] }
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