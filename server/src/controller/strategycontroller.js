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
  if (process.env.ISDEMO == 'false') {
    const { _id, portfolio, name, description, symbol, symboltype, lotsize, expiry, strikepricestep, isarchive, ismultiplesymbol, trades, createdon } = req.body;


    if (_id) {
      var _data = {
        _id,
        name,
        description,
        symbol,
        symboltype,
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
  } else {
    res.status(401);
    res.send({ "error": "Cant edit strategy on demo mode." })
  }


});

strategycontoller.post("/delete", async (req, res) => {
  var { _id } = req.body;
  DeleteStrategy(_id, res);
});


function DeleteStrategy(_id, res) {
  if (_id) {
    if (process.env.ISDEMO == 'false') {
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
