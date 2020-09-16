const express = require("express");
const router = express.Router();
const commonUtility =  require("../models/commonUtility");
const Strategy = require("../models/strategy");
require("dotenv/config");

router.get("/", async (req, res) => {
  var _porfolioid = req.body.protfolioid;
  const result = await Strategy.find({});
  res.json(result);
});

router.post("/find", (res, req) => {

});

router.post("/save", async (req, res) => {
  const {Name, Description, CreatedOn, Strategies } = req.body;
  console.log('commonUtil :>> ', commonUtility);
  const _portfolioObjectf = await commonUtility.GetPortfolioById(protfolioid);

  var strategy = new Strategy({ Name, Description, CreatedOn, Strategies });
  try {
    const result = await strategy.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.post("/update", async (req, res) => {
  const { pid, sid, Name, Description } = req.body;
  console.log('commonUtil :>> ', commonUtility.GetStartegyFromPorfolioById);

  var _portfolioObject = await commonUtility.GetStartegyFromPorfolioById(pid,sid);
  console.log(_portfolioObject);
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
