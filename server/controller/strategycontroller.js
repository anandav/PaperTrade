const express = require("express");
const router = express.Router();
const commUtility =  require("../models/commonUtility");
const Strategy = require("../models/strategy");




router.post("/find",async (res, req) => {
  res.send(await commUtility.GetStartegyById(req.body.sid));
});

router.post("/save", async (req, res) => {
  const {Name, Description, CreatedOn, Strategies } = req.body;
  const _portfolioObjectf = await commUtility.GetPortfolioById(protfolioid);
  var strategy = new Strategy({ Name, Description, CreatedOn, Strategies });
  try {
    const result = await strategy.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.post("/update", async (req, res) => {
  const {sid, Name, Description } = req.body;
  var _portfolioObject = await commUtility.GetStartegyById(sid);
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
