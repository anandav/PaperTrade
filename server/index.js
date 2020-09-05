const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 9090;

app.use(bodyParser.json());
app.use(cors());
const portfolio = require('./api/portfolio');

app.use('/portfolio', portfolio);

app.get("/",function(req,res){

  res.send("thank you");
});


app.listen(port, function(){
  console.log(`application listening on ${port}`);
});
