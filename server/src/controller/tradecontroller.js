const express = require("express");
const tradeController = express.Router();
const Strategy = require("../models/strategy");
const Trade = require("../models/trade");
const commonUtility = require("../models/commonUtility");

// tradeController.post("/find", async (res, req) => {
//   var { _id } = req.body;
//   res.send(await commUtility.GetTradeById(_id));
// });

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
    spotprice,
    note,

  } = req.body;
  var _trade = new Trade({
    symbol,
    lotsize,
    buyorsell,
    tradetype,
    quantity,
    selectedstrike,
    spotprice,
    note,
  });

  if (_id) {
    _trade._id = _id;
    const result = await Strategy.updateOne(
      { "trades._id": _id },
      { $set: { "trades.$": _trade } }
    );
    res.json(result);
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
    commonUtility.GetTradeById(tid).then(x => {
      console.log("trategy.trades----------");
      console.log(x);
      console.log("trategy.trades----------");
    });

    // Strategy.trades._id(tid).remove();
    // Strategy.save(function (err) {
    //   if (err) return console.error(err);
    //   console.log('the subdocs were removed');
    // });
    // var _trade = commonUtility.GetTradeById(tid);
    // console.log(tid);
    // var result = _strategy.trades(tid).remove();

    // Strategy.deleteOne({ _id: req.body._id }, (err, doc) => {
    //   res.json(doc);
    // });
  }
});

module.exports = tradeController;
