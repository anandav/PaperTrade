const express = require("express");
const router = express.Router();
const commUtility = require("../models/commonUtility");
const Strategy = require("../models/strategy");
const Portfolio = require("../models/portfolio");

router.post("/find", async (res, req) => {
  res.send(await commUtility.GetStartegyById(req.body.sid));
});

router.post("/save", async (req, res) => {
  const { pid, sid, Name, Description } = req.body;
  if (sid) {
    var _strategyObject = await Portfolio.updateOne(
      { "Strategies._id": sid },
      {
        $set: {
          "Strategies.$.Name": Name,
          "Strategies.$.Description": Description,
          "Strategies.$.ModifiedOn": new Date(),
        },
      }
    );
    res.send(_strategyObject);
  } else {
    const _portfolioObject = await commUtility.GetPortfolioById(pid);
    var strategy = new Strategy({ Name, Description, Symbol, CreatedOn: new Date() });
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
