const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 9090;

const mongoose = require("mongoose");
var portfolio = require('./api/portfolio');

//app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(cors());
app.get("/",function(req,res){
   res.send("thank you");
});

app.use('/portfolio', portfolio);


app.listen(port, function(){
  console.log(`application listening on ${port}`);
});
