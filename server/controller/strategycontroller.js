const express = require("express");
const starategycontoller = express.Router();
const commUtility = require("../models/commonUtility");
const Strategy = require("../models/strategy");
//const Portfolio = require("../models/portfolio");

starategycontoller.post("/find", async (res, req) => {
  res.send(await commUtility.GetStartegyById(req.body.sid));
});

starategycontoller.post("/save", async (req, res) => {
  const { sid, name, description, symbol } = req.body;
  if (sid) {
    var _strategyObject = await Portfolio.updateOne(
      { "strategies._id": sid },
      {
        $set: {
          "strategies.$.name": Name,
          "strategies.$.description": Description,
          "strategies.$.modifiedOn": new Date(),
        },
      }
    );
    res.send(_strategyObject);
  } else {
    //const _portfolioObject = await commUtility.GetPortfolioById(pid);
    const strategy = new Strategy({ name, description, symbol, createdon: new Date() });
	  //console.clear();
	  //console.log(startegy);
	  
    try {
     // _portfolioObject.Strategies.push(strategy);
     // const result = await _portfolioObject.save();
      const result = await startegy.Save();
      res.send(result);
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = starategycontoller;
