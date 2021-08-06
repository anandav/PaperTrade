const express = require("express");
const strategycontoller = express.Router();
const commUtility = require("../models/commonUtility");
const Strategy = require("../models/strategy");
const trade = require("../models/trade");

strategycontoller.get("/", async (req, res) => {
  await Strategy.find({})
    .populate("portfolios")
    .exec((err, data) => {
      res.json(data);
    });
});

strategycontoller.post("/find", async (res, req) => {
  res.send(await commUtility.GetStrategyById(req.body.sid));
});

strategycontoller.post("/findusingportfolioid", async (req, res) => {
  var { fieldName, fieldValue } = req.body;
  var result = {};
  if (fieldName && fieldValue) {

    result = await Strategy.find({ [fieldName]: fieldValue });
    if (data) {
      //res.json(data);
    }
    res.send({});
  } else {
    result = await Strategy.find({});
  }
  res.send(result);
});

strategycontoller.post("/save", async (req, res) => {
  const { _id,pid, name, description, symbol, trades, portfolios } = req.body;
  if (_id) {
    var _data = {
      name,
      description,
      symbol,
      modifiedOn: new Date(),
    };
    if (trades) {
      _data.trades = trades;
    }
    if (portfolios) {
      _data.portfolios = portfolios;
    }
    var _strategyObject = await Strategy.updateOne(
      { _id: _id },
      {
        $set: _data,
      }
    );
    res.send(_strategyObject);
  } else {
    const strategy = new Strategy({
      name,
      description,
      symbol,
      trades,
      portfolios,
      createdon: new Date(),
    });
    try {
      const result = await strategy.save();
      res.send(result);
    } catch (err) {
      console.log(err);
    }
  }
});

strategycontoller.post("/delete", async (req, res) => {
  var { _id } = req.body;
  if (_id) {
    Strategy.deleteOne({ _id: _id }, (err, doc) => {
      res.json(doc);
    });
  }
});

module.exports = strategycontoller;
