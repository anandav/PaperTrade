const express = require("express");
const router = express.Router();
const Trade = require("../models/trade");
const commonUtility = require("../models/commonUtility");

router.post("/find", async (res, req) => {
  res.send(await commUtility.GetTradeById(req.body.tid));
});

router.post("/save", async (req, res) => {
  const {
    sid,
    tid,
    BuyOrSell,
    Quantity,
    TradeType,
    DayToExpiry,
    StrikePrice,
    PremiumPrice,
  } = req.body;
  if (tid) {
    //update
  } else {
    var trade = new Trade({
      BuyOrSell,
      Quantity,
      TradeType,
      DayToExpiry,
      StrikePrice,
      PremiumPrice,
    });
    var trades = [trade];
    var _strategyObject = await commonUtility.GetStartegyById(sid);

    // console.log("_strategyObject :>> ", _strategyObject);

    try {
      // const result = await _strategyObject.updateOne(
      //   {
      //     "Strategies._id": sid,
      //   },
      //   { $set: { "Strategies.$.Trades": trade } }
      // );
      const result = await _strategyObject.updateOne(
        {},
        { $set: { "Strategies.$[_sid].Name": "testing" } },
        {
          arrayFilters: [
            {
              "s_id": sid,
            },
          ],
        }
      );

      var _strategyObject2 = await commonUtility.GetStartegyById(sid);

      console.log("_strategyObject2 :>> ", _strategyObject2);

      console.log("result :>> ", result);
      res.send(result);
    } catch (err) {
      console.log("err :>> ", err);
    }
  }
});

module.exports = router;
