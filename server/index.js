const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 9090;
const mongoose = require("mongoose");
const portfolioCotroller = require('./controller/portfoliocotroller');
//const UserControls = require("./controller/usercontroller");

app.use(bodyParser.json());
app.use(cors());
app.use('/portfolio', portfolioCotroller);

app.get("/",function(req,res){
  res.send("thank you");
});

mongoose.connect(process.env.DBCONNECTIONSTRING,
  {useNewUrlParser: true, useUnifiedTopology : true},()=>{
  console.log("DB connected.");
});

//app.use(require("./route"));

app.listen(port, function(){
  console.log(`application listening on ${port}`);
});
