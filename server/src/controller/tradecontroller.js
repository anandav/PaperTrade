const express = require("express");
const tradeController = express.Router();
const Strategy = require("../models/strategy");
const Trade = require("../models/trade");
const commonUtility = require("../models/commonUtility");

tradeController.post("/find", async (res, req) => {
  var { _id } = req.body;
  res.send(await commUtility.GetTradeById(_id));
});

tradeController.post("/save", async (req, res) => {
  const {
    sid,
    _id,
    issell,
    quantity,
    iscall,
    isfuture,
    daystoexpiry,
    strikeprice,
    premiumprice,
  } = req.body;
  var _trade = new Trade({
    issell,
    quantity,
    iscall,
    isfuture,
    daystoexpiry,
    strikeprice,
    premiumprice,
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
    }
    res.json({"error_msg":"Strategy not found."});
  }
});

tradeController.post("/delete", async (req, res) => {
  var { _id } = req.body;
  if (_id) {
    var _strategy = commUtility.GetTradeById(_id);
    var result = _strategy.trades._id(_id).remove();

    // Strategy.deleteOne({ _id: req.body._id }, (err, doc) => {
    //   res.json(doc);
    // });
  }
});

module.exports = tradeController;
