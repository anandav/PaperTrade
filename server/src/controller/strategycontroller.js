const express = require("express");
const strategycontoller = express.Router();
const commUtility = require("../models/commonUtility");
const portfolio = require("../models/portfolio");
const Strategy = require("../models/strategy");
const trade = require("../models/trade");

strategycontoller.post("/findusingportfolioid", async (req, res) => {



  var { fieldName, fieldValue } = req.body;
  var result = {};
  if (fieldName && fieldValue) {
    result = await Strategy.find({ [fieldName]: fieldValue }).sort({ createdon: -1 });
    res.json(result);
  } else {
    result = await Strategy.find({});
  }
});

strategycontoller.post("/save", async (req, res) => {
  const { _id, portfolio, name, description, symbol, lotsize, expiry, strikepricestep, isarchive, ismultiplesymbol, trades, createdon } = req.body;


  if (_id) {
    var _data = {
      _id,
      name,
      description,
      symbol,
      lotsize,
      expiry,
      strikepricestep,
      isarchive,
      ismultiplesymbol,
      portfolio,
      createdon,
      modifiedon: new Date(),
    };
    if (trades) {
      _data.trades = trades;
    }
    var _strategyObject = await Strategy.updateOne(
      { _id: _id },
      {
        $set: _data,
      }
    );
    res.send(_data);
  } else {
    const strategy = new Strategy({
      name,
      description,
      symbol,
      ismultiplesymbol,
      lotsize,
      expiry,
      strikepricestep,
      isarchive,
      trades,
      portfolio,
      createdon: new Date(),
      modifiedon: new Date(),
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
  var doc = DeleteStrategy(_id);
  res.json(doc);
});


function DeleteStrategy(_id) {
  if (_id) {
    Strategy.deleteOne({ _id: _id }, (err, doc) => {
      return doc;
    });
  }
};


module.exports = strategycontoller;
