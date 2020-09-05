const express = require("express");
const router = express.Router();

router.post("/getallportfolio",function(req, res){
  res.write("getalportfolio called");
});
