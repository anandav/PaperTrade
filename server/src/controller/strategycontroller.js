const express = require("express");
const strategycontoller = express.Router();
const commUtility = require("../models/commonUtility");
const Strategy = require("../models/strategy");
const trade = require("../models/trade");

strategycontoller.post("/findusingportfolioid", async (req, res) => {
  var { fieldName, fieldValue } = req.body;
  var result = {};
  if (fieldName && fieldValue) {
    result = await Strategy.find({ [fieldName]: fieldValue });
    console.log(result);
    res.json(result);
  } else {
    result = await Strategy.find({});
  }
});

strategycontoller.post("/save", async (req, res) => {
  const { _id, portfolio, name, description, symbol, trades, createdon} = req.body;
  
  if (_id) {
    var _data = {
      _id,
      name,
      description,
      symbol,
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
      console.log("_data");
      console.log(_data);

    res.send(_data);
  } else {
    const strategy = new Strategy({
      name,
      description,
      symbol,
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
  if (_id) {
    Strategy.deleteOne({ _id: _id }, (err, doc) => {
      res.json(doc);
    });
  }
});


strategycontoller.post("/deleteusingportfolio", async (req, res) => {
  var { portfolio } = req.body;
  if (_id) {
    Strategy.deleteOne({ portfolio }, (err, doc) => {
      res.json(doc);
    });
  }
});


module.exports = strategycontoller;
