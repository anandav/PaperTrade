const express = require("express");
const portfolicontroller = express.Router();
const Portfolio = require("../models/portfolio");
const commonUtility = require("../models/commonUtility");

require("dotenv/config");

portfolicontroller.get("/", async (req, res) => {
  const data = await Portfolio.find({},{"name": 1,"description":1});
  res.json(data);
});

portfolicontroller.post("/find", async (req, res) => {
  var { fieldName, fieldValue } = req.body;
  var result = {};
  if (fieldName && fieldValue) {
    result = await Portfolio.find({ [fieldName]: fieldValue });
    }else {
    result  =  await Portfolio.find();
  }
  res.send(result);
});

portfolicontroller.post("/save", async (req, res) => {
  const {  pid, name, description, createdon } = req.body;
  var _portfolioObject = {};
  if (pid) {
     _portfolioObject = await commonUtility.GetPortfolioById(pid);
     _portfolioObject.name = name;
     _portfolioObject.description = description;
     _portfolioObject.modifiedon = new Date();
  } else {
     _portfolioObject = new Portfolio({ name, description, createdon });
  }

  try {
    console.log('_portfolioObject :>> ', _portfolioObject);
    const result = await _portfolioObject.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

module.exports = portfolicontroller;





