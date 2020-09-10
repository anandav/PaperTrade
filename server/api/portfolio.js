const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");

var portfolios = [
  { name: 'TJ', email: 'tj@vision-media.ca' },
  { name: 'Tobi', email: 'tobi@vision-media.ca' }
];

router.getAllProtfolio = function(req, res){
   res.send(portfolios);
};

router.getProtfolio = function(req, res){
  res.send(portfolios);
};


module.exports = router;
