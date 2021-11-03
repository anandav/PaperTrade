const express = require("express");
const tradeController = express.Router();
const Strategy = require("../models/strategy");
const Trade = require("../models/trade");
const commonUtility = require("../models/commonUtility");

tradeController.post("/save", async (req, res) => {
  const {
    sid,
    _id,
    symbol,
    lotsize,
    buyorsell,
    tradetype,
    quantity,
    selectedstrike,
    price,
    lasttradedprice,
    isexit,
    partnerid,
    note,
    group,
    strikepricemin,
    strikepricemax,
    strikepricestep,

  } = req.body;
  var _trade = new Trade({
    symbol,
    lotsize,
    buyorsell,
    tradetype,
    quantity,
    selectedstrike,
    price,
    lasttradedprice,
    isexit,
    partnerid,
    note,
    group,
    strikepricemin,
    strikepricemax,
    strikepricestep,
  });

  if (_id) {
    _trade._id = _id;
    await Strategy.updateOne(
      { "trades._id": _id },
      { $set: { "trades.$": _trade } }
    );

    commonUtility.GetTradeById(_id).then((_result) => {
      res.json(_result);
    });
  } else if (sid && !_id) {
    var _strategyObject = await commonUtility.GetStrategyById(sid);
    if (_strategyObject) {
      _strategyObject.trades.push(_trade);
      _strategyObject.save(function (_error, doc) {
        res.json(doc);
      });
    } else {
      res.json({ "error_msg": "Strategy not found." });
    }
  }
});

tradeController.post("/delete", async (req, res) => {
  var { tid } = req.body;
  if (tid) {

    const result = await Strategy.updateOne({ "trades._id": tid },
      { $pull: { "trades": { _id: tid } } },
      { new: true }, function (err) {
        if (err) { console.log(err); }
      }
    );
    res.json(result);
  }
});

module.exports = tradeController;
