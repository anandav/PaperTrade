const express = require("express");
const router = express.Router();
const Portfolio = require("../models/portfolio");
require("dotenv/config");

router.get("/", async (req, res) => {
  const data = await Portfolio.find();
  res.json(data);
});

router.post("/find", async (req, res) => {
  var { fieldName, fieldValue } = req.body;
  var result = {};
  if (fieldName && fieldValue) {
    result = await Portfolio.find({ [fieldName]: fieldValue });
  }
  res.json(result);
});

router.post("/save", async (req, res) => {
  const { Name, Description, CreatedOn, Strategies } = req.body;
  var portfolio = new Portfolio({ Name, Description, CreatedOn, Strategies });
  try {
    const result = await portfolio.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.post("/update", async (req, res) => {
  const { Name, Description } = req.body;
  var _portfolioObject = await Portfolio.findOne({ _id: req.body._id });
  _portfolioObject.Name = Name;
  _portfolioObject.Description = Description;
  _portfolioObject.ModifiedOn = new Date();
  try {
    const result = await _portfolioObject.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});


module.exports = router;
