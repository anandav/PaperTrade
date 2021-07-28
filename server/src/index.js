const express = require("express");
const cors = require("cors");

const app = express();
const port = 9090;
const mongoose = require("mongoose");
const strategyController = require("./controller/strategycontroller");
const portfolioCotroller = require("./controller/portfoliocotroller");

const tradeController = require("./controller/tradecontroller");

app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.use(cors());
app.use("/", (req, res, next) => {
  process.stdout.write("\033c");
  //console.clear();
  console.log("Body");
  console.log("====");
  console.log(req.body);
  console.log("====");
  next();
});


app.use("/strategy",strategyController);
app.use("/portfolio", portfolioCotroller);
app.use("/trade",tradeController);

mongoose.connect(
  process.env.DBCONNECTIONSTRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("DB connected.");
  }
);


//app.use(require("./route"));

app.listen(port, function () {
  console.log(`application listening on ${port}`);
});
