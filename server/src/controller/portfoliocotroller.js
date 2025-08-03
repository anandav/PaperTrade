const express = require("express");
const portfolicontroller = express.Router();
const Portfolio = require("../models/portfolio");
const commonUtility = require("../models/commonUtility");
const ApiError = require("../common/ApiError");

require("dotenv/config");

portfolicontroller.get("/", async (req, res) => {
  const data = await Portfolio.find().sort({ modifiedon: -1 });
  res.json(data);
});

portfolicontroller.post("/find", async (req, res) => {
  let { fieldName, fieldValue } = req.body;
  let result = {};
  if (fieldName && fieldValue) {
    result = await Portfolio.find({ [fieldName]: fieldValue }).sort({
      order: -1
    });
  } else {
    result = await Portfolio.find().sort({ order: -1 });
  }
  res.send(result);
});

portfolicontroller.post("/save", async (req, res) => {
  if (process.env.ENABLE_DEMO == "false") {
    const { _id, name, exchange, openingbalance, description, createdon, updateui } = req.body;

    let _portfolioObject;
    if (_id) {
      _portfolioObject = await commonUtility.GetPortfolioById(_id);
      if (!_portfolioObject) {
        throw new ApiError(404, "Portfolio not found.");
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
        description,
        createdon: new Date(),
      });
    }

    const result = await _portfolioObject.save();
    if (updateui) {
      const _allportfolio = await Portfolio.find();
      res.send(_allportfolio);
    } else {
      res.send(result);
    }
  } else {
    throw new ApiError(401, "Cant edit portfolio on demo mode.");
  }
});

portfolicontroller.post("/saveall", async (req, res) => {
  if (process.env.ENABLE_DEMO == "true") {
    throw new ApiError(401, "Cant save all portfolios in demo mode.");
  }

  let _portfolios = req.body;
  for (const item of _portfolios) {
    let _portfolioObject = await commonUtility.GetPortfolioById(item._id);
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
  res.send(await findPortfolio());
});

portfolicontroller.post("/delete", async (req, res) => {
  const pid = req.body._id;
  if (!pid) {
    throw new ApiError(400, 'Portfolio ID (_id) is required.');
  }

  if (process.env.ENABLE_DEMO == "false") {
    await commonUtility.DeleteStrategyUsingPortfolioID(pid);
    const result = await Portfolio.deleteOne({ _id: pid });
    if (result.deletedCount === 0) {
      throw new ApiError(404, 'Portfolio not found.');
    }
    res.json({ message: "Portfolio and related strategies deleted successfully." });
  } else {
    throw new ApiError(401, "Cant delete portfolio on demo mode.");
  }
});

async function findPortfolio() {
  return await Portfolio.find().sort({ order: 1 });
}

module.exports = portfolicontroller;