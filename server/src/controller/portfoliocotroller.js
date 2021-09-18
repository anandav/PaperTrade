const express = require("express");
const portfolicontroller = express.Router();
const Portfolio = require("../models/portfolio");
const commonUtility = require("../models/commonUtility");

require("dotenv/config");

portfolicontroller.get("/", async (req, res) => {
  const data = await Portfolio.find();
  res.json(data);
});

portfolicontroller.post("/find", async (req, res) => {
  var { fieldName, fieldValue } = req.body;
  var result = {};
  if (fieldName && fieldValue) {
    result = await Portfolio.find({ [fieldName]: fieldValue });
  } else {
    result = await Portfolio.find();
  }
  res.send(result);
});

portfolicontroller.post("/save", async (req, res) => {
  const { _id, name, description, createdon, updateui } = req.body;
  var _portfolioObject = {};
  if (_id) {
    _portfolioObject = await commonUtility.GetPortfolioById(_id);
    _portfolioObject.name = name;
    _portfolioObject.description = description;
    _portfolioObject.modifiedon = new Date();
  } else {
    _portfolioObject = new Portfolio({ name, description, createdon });
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
    console.log(err);
    res.send(err);
  }
});


portfolicontroller.post("/delete", async (req, res) => {
  var pid = req.body._id;
  if (pid) {
    commonUtility.DeleteStrategyUsingPortfolioID(pid);
    Portfolio.deleteOne({ _id: pid }, (err, doc) => {
      res.send(doc);
    });
  }
});

module.exports = portfolicontroller;
