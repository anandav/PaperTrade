const express = require("express");
const router = express.Router();
const commonUtility =  require("../models/commonUtility");


router.post("/find",async (res, req) => {
  res.send(await commUtility.GetTradeById(req.body.tid));
});
