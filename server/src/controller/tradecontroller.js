const express = require("express");
const tradeController = express.Router();
const Strategy = require("../models/strategy");
const Trade = require("../models/trade");
const commonUtility = require("../models/commonUtility");

tradeController.post("/save", async (req, res) => {
  if (process.env.ENABLE_DEMO == 'false') {
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
      order,
      color,
      createdon,
      modifiedon,

    } = req.body;
    let _trade = new Trade({
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
      order,
      color,
      createdon: new Date(),
      modifiedon: new Date(),
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
      let _strategyObject = await commonUtility.GetStrategyById(sid);
      if (_strategyObject) {
        _strategyObject.trades.push(_trade);
        _strategyObject.save(function (_error, doc) {
          res.json(doc);
        });
      } else {
        res.json({ "error_msg": "Strategy not found." });
      }
    }
  } else {
    res.status(401);
    res.send({ "error": "Cant edit trade on demo mode." })
  }
});

tradeController.post("/delete", async (req, res) => {
  let { tid } = req.body;
  if (tid) {
    if (process.env.ENABLE_DEMO == 'false') {
      const result = await Strategy.updateOne({ "trades._id": tid },
        { $pull: { "trades": { _id: tid } } },
        { new: true }, function (err) {
          if (err) { console.error(err); }
        }
      );
      res.json(result);
    } else {
      res.status(401);
      res.json({ "error": "Cant delete trade on demo mode." })
    }
  }
});

module.exports = tradeController;
