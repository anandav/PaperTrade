const express = require("express");
const router = express.Router();
const commUtility = require("../models/commonUtility");
const Strategy = require("../models/strategy");
const Portfolio = require("../models/portfolio")

router.post("/find", async (res, req) => {
  res.send(await commUtility.GetStartegyById(req.body.sid));
});

router.post("/save", async (req, res) => {
  const { pid, sid, Name, Description, CreatedOn } = req.body;
  if (sid) {
    var strategy = new Strategy({ Name, Description });
    strategy.ModifiedOn = new Date();

    var _strategyObject = await Portfolio.findOneAndUpdate(
      { "Strategies._id": sid },
      { $set: { "Strategies.$": strategy } }
    ); //await commUtility.GetStartegyById(sid);
    // _strategyObject.Name = Name;
    // _strategyObject.Description = Description;
    // _strategyObject.ModifiedOn = new Date();

    try {
      const result = await _strategyObject.save();
      res.send(result);
    } catch (err) {
      console.log(err);
    }
  } else {
    const _portfolioObject = await commUtility.GetPortfolioById(pid);
    var strategy = new Strategy({ Name, Description, CreatedOn });
    try {
      _portfolioObject.Strategies.push(strategy);
      const result = await _portfolioObject.save();
      res.send(result);
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
