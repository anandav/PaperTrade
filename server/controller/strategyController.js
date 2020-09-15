const express = require("express");
const router = express.Router();
const Strategy = require("../models/strategy");
require("dotenv/config");

router.get("/", async (req, res) => {
  //process.stdout.write('\033c');
  const data = await Strategy.find();
  res.json(data);
});

router.get("/find",(res, req)=>{
//ToDo
});

router.post("/save", async (req, res) => {
  // process.stdout.write('\033c');
  const { Name, Description, CreatedOn, Strategies } = req.body;
  var strategy = new Strategy({ Name, Description, CreatedOn, Strategies });
  try {
    const result = await strategy.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.post("/update", async (req, res) => {
  //process.stdout.write("\033c");
  const { Name, Description } = req.body;
  var _portfolioObject = await Strategy.findOne({ _id: req.body._id });
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
