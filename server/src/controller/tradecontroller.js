const express = require("express");
const tradeController = express.Router();
const Strategy = require("../models/strategy");
const Trade = require("../models/trade");
const commonUtility = require("../models/commonUtility");
const ApiError = require("../common/ApiError");

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

      const _result = await commonUtility.GetTradeById(_id);
      res.json(_result);

    } else if (sid && !_id) {
      let _strategyObject = await commonUtility.GetStrategyById(sid);
      if (_strategyObject) {
        _strategyObject.trades.push(_trade);


       var result = await _strategyObject.save();
       console.log("out:Trade saved successfully", result);
       res.json(result);
       
      } else {
        throw new ApiError(404, "Strategy not found.");
      }
    }
  } else {
    throw new ApiError(401, "Cant edit trade on demo mode.");
  }
});

tradeController.post("/delete", async (req, res) => {
  const { tid } = req.body;
  if (!tid) {
    throw new ApiError(400, 'Trade ID (tid) is required.');
  }

  if (process.env.ENABLE_DEMO == 'false') {
    const result = await Strategy.updateOne(
      { "trades._id": tid },
      { $pull: { "trades": { _id: tid } } }
    );
    
    if (result.nModified === 0) {
        // This is optional, but good practice. It tells the client if the trade wasn't found.
        throw new ApiError(404, 'Trade not found or already deleted.');
    }

    res.json({ message: 'Trade deleted successfully.' });
  } else {
    throw new ApiError(401, "Cant delete trade on demo mode.");
  }
});

module.exports = tradeController;
