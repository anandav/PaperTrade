const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Portfolio = require("../models/portfolio");
require("dotenv/config");
const collectionName = "portfolio";

router.get("/", async (req, res) => {
  const data =await Portfolio.find().exec();
  res.json(data);
});
router.post("/save",async (req, res) => {
  var bdy = req.body;
  var portfolio = new Portfolio({
    Name: bdy.Name,
    Description: bdy.Description,
    CreatedOn: bdy.CreatedOn,
  });
  try {
    const savePost = await portfolio.save().then(i=>
     {
       return i;
     });
    res.status(201).send(savePost);
  } catch (err) {
    console.log(err);
  }
});


mongoose.connect(process.env.DBCONNECTIONSTRING,
  {useNewUrlParser: true, useUnifiedTopology : true},()=>{
  console.log("DB connected.");
});

module.exports = router;
