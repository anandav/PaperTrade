const express = require("express");
const portfolicontroller = express.Router();
const Portfolio = require("../models/portfolio");
const commonUtility = require("../models/commonUtility");
const portfolio = require("../models/portfolio");

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

    let _portfolioObject = {};
    if (_id) {
      _portfolioObject = await commonUtility.GetPortfolioById(_id);
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
        createdon,
      });
    }
    try {
      const result = await _portfolioObject.save();
      if (updateui) {
        const _allportfolio = await Portfolio.find();
        res.send(_allportfolio);
      } else {
        res.send(result);
      }
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  } else {
    res.status(401);
    res.send({ error: "Cant edit portfolio on demo mode." });
  }
});
portfolicontroller.post("/saveall", async (req, res) => {
  let _portfolios = req.body;
  let _portfolioObject = {};
  _portfolios.forEach(async (item) => {
    _portfolioObject = await commonUtility.GetPortfolioById(item._id);
    _portfolioObject.name = item.name;
    _portfolioObject.exchange = item.exchange;
    _portfolioObject.openingbalance = item.openingbalance;
    _portfolioObject.description = item.description;
    _portfolioObject.order = item.order;
    _portfolioObject.modifiedon = new Date();
    const result = await _portfolioObject.save();
  });
  res.send(await findPortfolio());
});

portfolicontroller.post("/delete", async (req, res) => {
  let pid = req.body._id;
  if (pid) {
    if (process.env.ENABLE_DEMO == "false") {
      commonUtility.DeleteStrategyUsingPortfolioID(pid);
      Portfolio.deleteOne({ _id: pid }, (err, doc) => {
        res.send(doc);
      });
    } else {
      res.status(401);
      res.send({ error: "Cant delete portfolio on demo mode." });
    }
  }
});

async function findPortfolio() {
  return await Portfolio.find().sort({ order: 1 });
}

module.exports = portfolicontroller;
