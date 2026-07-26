const express = require("express");
const mongoose = require("mongoose");
const strategycontoller = express.Router();
const commUtility = require("../models/commonUtility");
const Strategy = require("../models/strategy");
const ApiError = require("../common/ApiError");

const activeFilter = commUtility.activeFilter;

strategycontoller.post("/findusingportfolioid", async (req, res) => {
  let { fieldName, fieldValue } = req.body;
  let result = {};
  if (fieldName && fieldValue) {
    result = await Strategy.aggregate([
      {
        $match: {
          [fieldName]: new mongoose.Types.ObjectId(`${fieldValue}`),
          userId: req.user._id,
          isactive: { $ne: false },
        },
      },
      { $sort: { createdon: -1, "trades.order": -1 } },
    ]);
    res.json(result);
  } else {
    result = await Strategy.find({
      userId: req.user._id,
      ...activeFilter,
    });
    res.json(result);
  }
});

strategycontoller.post("/save", async (req, res) => {
  if (!(global.appConfig && global.appConfig.enableDemo)) {
    const {
      _id,
      portfolio,
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
      trades,
    } = req.body;
    let _data = {
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
      modifiedon: new Date(),
    };

    if (trades) {
      _data.trades = trades;
    }

    if (_id) {
      const result = await Strategy.updateOne(
        { _id: _id, userId: req.user._id, ...activeFilter },
        {
          $set: _data,
        }
      );
      if (result.matchedCount === 0) {
        throw new ApiError(404, "Strategy not found or unauthorized.");
      }
      res.send({ ..._data, _id, userId: req.user._id });
    } else {
      _data.createdon = new Date();
      _data.userId = req.user._id;
      _data.isactive = true;
      const strategy = new Strategy(_data);
      const result = await strategy.save();
      res.status(201).send(result);
    }
  } else {
    throw new ApiError(401, "Cant edit strategy on demo mode.");
  }
});

strategycontoller.post("/delete", async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    throw new ApiError(400, "Strategy ID (_id) is required.");
  }

  if (!(global.appConfig && global.appConfig.enableDemo)) {
    const result = await Strategy.updateOne(
      { _id: _id, userId: req.user._id, ...activeFilter },
      { $set: { isactive: false, modifiedon: new Date() } }
    );
    if (result.matchedCount === 0) {
      throw new ApiError(404, "Strategy not found or unauthorized.");
    }
    res.json({ message: "Strategy deactivated successfully." });
  } else {
    throw new ApiError(401, "Cant delete strategy on demo mode.");
  }
});

module.exports = strategycontoller;
