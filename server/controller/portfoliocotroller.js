const express = require("express");
const router = express.Router();
const Portfolio = require("../models/portfolio");
const commonUtility = require("../models/commonUtility");
require("dotenv/config");

router.get("/", async (req, res) => {
  const data = await Portfolio.find({},{"Name": 1,"Description":1});
  res.json(data);
});

router.post("/find", async (req, res) => {
  var { fieldName, fieldValue } = req.body;
  var result = {};
  if (fieldName && fieldValue) {
    result = await Portfolio.find({ [fieldName]: fieldValue });
  }else {
    result  =  await Portfolio.find();
  }
  res.json(result);
});

router.post("/save", async (req, res) => {
  const {  pid, Name, Description, CreatedOn, Strategies } = req.body;
  var _portfolioObject = {};
  if (pid) {
     _portfolioObject = await commonUtility.GetPortfolioById(pid);
     _portfolioObject.Name = Name;
     _portfolioObject.Description = Description;
     _portfolioObject.ModifiedOn = new Date();
  } else {
     _portfolioObject = new Portfolio({ Name, Description, CreatedOn, Strategies });
  }

  try {
    const result = await _portfolioObject.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});



module.exports = router;
