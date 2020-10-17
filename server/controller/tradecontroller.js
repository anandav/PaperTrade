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
    _id,
    issell,
    quantity,
    callorput,
    isfuture,
    daystoexpiry,
    strikeprice,
    premiumprice,
  } = req.body;
  if (_id) {
    //update
  } else {
    //insert
    
  }

  try {
    var result = "";

    res.send(result);
  } catch (err) {
    console.log("err :>> ", err);
  }
});

module.exports = router;
