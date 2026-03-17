const express = require("express");
const portfolicontroller = express.Router();
const Portfolio = require("../models/portfolio");
const commonUtility = require("../models/commonUtility");
const ApiError = require("../common/ApiError");

portfolicontroller.get("/", async (req, res) => {
  const data = await Portfolio.find({ userId: req.user._id }).sort({ modifiedon: -1 });
  res.json(data);
});

portfolicontroller.post("/find", async (req, res) => {
  let { fieldName, fieldValue } = req.body;
  let query = { userId: req.user._id };
  if (fieldName && fieldValue) {
    query[fieldName] = fieldValue;
  }
  const result = await Portfolio.find(query).sort({ order: -1 });
  res.send(result);
});

portfolicontroller.post("/save", async (req, res) => {
  if (!(global.appConfig && global.appConfig.enableDemo)) {
    const { _id, name, exchange, openingbalance, description, updateui } = req.body;

    let _portfolioObject;
    if (_id) {
      _portfolioObject = await Portfolio.findOne({ _id, userId: req.user._id });
      if (!_portfolioObject) {
        throw new ApiError(404, "Portfolio not found or unauthorized.");
      }
      _portfolioObject.name = name;
      _portfolioObject.exchange = exchange;
      _portfolioObject.openingbalance = openingbalance;
      _portfolioObject.description = description;
      _portfolioObject.modifiedon = new Date();

    } else {
      _portfolioObject = new Portfolio({
        name,
        exchange,
        openingbalance,
        description,
        userId: req.user._id,
        createdon: new Date(),
      });
    }

    const result = await _portfolioObject.save();
    if (updateui) {
      const _allportfolio = await Portfolio.find({ userId: req.user._id }).sort({ order: 1 });
      res.send(_allportfolio);
    } else {
      res.send(result);
    }
  } else {
    throw new ApiError(401, "Cant edit portfolio on demo mode.");
  }
});

portfolicontroller.post("/saveall", async (req, res) => {
  if (global.appConfig && global.appConfig.enableDemo) {
    throw new ApiError(401, "Cant save all portfolios in demo mode.");
  }

  let _portfolios = req.body;
  for (const item of _portfolios) {
    let _portfolioObject = await Portfolio.findOne({ _id: item._id, userId: req.user._id });
    if (_portfolioObject) {
      _portfolioObject.name = item.name;
      _portfolioObject.exchange = item.exchange;
      _portfolioObject.openingbalance = item.openingbalance;
      _portfolioObject.description = item.description;
      _portfolioObject.order = item.order;
      _portfolioObject.modifiedon = new Date();
      await _portfolioObject.save();
    }
  }
  res.send(await Portfolio.find({ userId: req.user._id }).sort({ order: 1 }));
});

portfolicontroller.post("/delete", async (req, res) => {
  const pid = req.body._id;
  if (!pid) {
    throw new ApiError(400, 'Portfolio ID (_id) is required.');
  }

  if (!(global.appConfig && global.appConfig.enableDemo)) {
    const portfolioToDelete = await Portfolio.findOne({ _id: pid, userId: req.user._id });
    if (!portfolioToDelete) {
      throw new ApiError(404, 'Portfolio not found or unauthorized.');
    }
    await commonUtility.DeleteStrategyUsingPortfolioID(pid);
    await Portfolio.deleteOne({ _id: pid });
    res.json({ message: "Portfolio and related strategies deleted successfully." });
  } else {
    throw new ApiError(401, "Cant delete portfolio on demo mode.");
  }
});

async function findPortfolio() {
  return await Portfolio.find().sort({ order: 1 });
}

module.exports = portfolicontroller;