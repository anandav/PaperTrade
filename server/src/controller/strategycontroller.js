const express = require("express");
const mongoose = require('mongoose');
const strategycontoller = express.Router();
const commUtility = require("../models/commonUtility");
const portfolio = require("../models/portfolio");
const Strategy = require("../models/strategy");
const trade = require("../models/trade");

strategycontoller.post("/findusingportfolioid", async (req, res) => {
  let { fieldName, fieldValue } = req.body;
  let result = {};
  if (fieldName && fieldValue) {
    result = await Strategy.aggregate(
      [
        { $match: { [fieldName]: mongoose.Types.ObjectId(fieldValue) } },
        { $sort: { "createdon": -1, 'trades.order': -1 } }
      ]
    );
    res.json(result);
  } else {
    result = await Strategy.find({});
  }
});

strategycontoller.post("/save", async (req, res) => {
  if (process.env.ENABLE_DEMO == 'false') {
    const { _id, portfolio, name, description, symbol, symboltype, lotsize, expiry, strikepricestep, isarchive, hidechart,ismultiplesymbol, trades, createdon } = req.body;
    let _data = {
      _id,
      name,
      description,
      symbol,
      symboltype,
      lotsize,
      expiry,
      strikepricestep,
      isarchive,
      hidechart,
      ismultiplesymbol,
      portfolio,
      createdon,
      modifiedon: new Date(),
    };

    if (trades) {
      _data.trades = trades;
    }

    if (_id) {
      let _strategyObject = await Strategy.updateOne(
        { _id: _id },
        {
          $set: _data,
        }
      );
      res.send(_data);
    } else {
   const strategy = new Strategy(_data);
      try {
        _data.createdon = new Date();
        const result = await strategy.save();
        res.send(result);
      } catch (err) {
        console.error(err);
      }
    }
  } else {
    res.status(401);
    res.send({ "error": "Cant edit strategy on demo mode." })
  }


});

strategycontoller.post("/delete", async (req, res) => {
  let { _id } = req.body;
  DeleteStrategy(_id, res);
});


function DeleteStrategy(_id, res) {
  if (_id) {
    if (process.env.ENABLE_DEMO == 'false') {
      Strategy.deleteOne({ _id: _id }, (err, doc) => {
        res.json(doc);
      });
    } else {

      res.status(401);
      res.json({ "error": "Cant delete strategy on demo mode." });
    }
  }
};


module.exports = strategycontoller;
