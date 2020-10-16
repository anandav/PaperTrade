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
      isbuy,
      isfuture,
      quantity,
      daytoexpiry,
      strikeprice,
      premiumprice,
    });
    var trades = [trade];
    var _strategyObject = await commonUtility.GetStrategyById(sid);
    try {
      const result = await _strategyObject.updateOne(
        {},
        { $set: { "strategies.$[_sid].name": "testing" } },
        {
          arrayFilters: [
            {
              s_id: sid,
            },
          ],
        }
      );
      var _strategyObject2 = await commonUtility.GetStrategyById(sid);
      res.send(result);
    } catch (err) {
      console.log("err :>> ", err);
    }
  }
});

module.exports = router;
