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
        { "exchange": "NSE", "isactive": true, "name": "National Stock Exchange.", "segmentendpoints": ["EQUITY", "EQUITYFUTURES", "EQUITYOPTIONS", "CURRENCYFUTURES", "CURRENCYOPTIONS", "INDICESFUTURES", "INDICESOPTIONS"] },
        { "exchange": "CBOE", "isactive": true, "name": "Chicago Board Options Exchange.", "segmentendpoints": ["OPTIONS"] },
        { "exchange": "BSE", "isactive": false, "name": "Bombay Stock Exchange.", "segmentendpoints": ["EQUITY", "CURRENCYFUTURES", "CURRENCYOPTIONS"] },
        { "exchange": "MCX", "isactive": false, "name": "Multi Commodity Exchange.", "segmentendpoints": ["FUTURES"] },
        { "exchange": "WAXIRX", "isactive": false, "name": "Crypto Exchange.", "segmentendpoints": ["CRYPTO"] }
    ];
    return result;
}


async function get(req, res) {
    ///
    ///இன்னும் எப்படி சரியா எழுத்தும் முடிவு பண்ணலேs
    ///
    const exchange = req.params.exchange?.toUpperCase();
    const segment = req.params.segment?.toUpperCase();
    const symbol = req.params.symbol?.toUpperCase();
    if (exchange == "NSE") {
        if (segment == "EQUITY") {

        }
        else if (segment == "FUTURES") {
          
                res.json(await nse.GetEquitiesList());
        } else if (segment == "INDICESOPTIONS") {
            res.json(await nse.GetIndicesOptionChain(symbol));
        } else if (segment == "CURRENCYFUTURES") {

        }
        else if (segment == "CURRENCYOPTIONS") {
            res.json(await nse.GetCurrencyOptionChain(symbol));

        }
        else if (segment == "INDICES") {
            res.json(await nse.GetAllIndices());
        }
    } else {
        res.json({ "error": "not a valid request." });
    }
}

module.exports = dataprovider;