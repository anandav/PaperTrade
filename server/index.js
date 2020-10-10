const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 9090;
const mongoose = require("mongoose");
const portfolioCotroller = require("./controller/portfoliocotroller");
const strategyController = require("./controller/strategycontroller");
const tradeController = require("./controller/tradecontroller");

app.use(bodyParser.json());
app.use(cors());
app.use("/", (req, res, next) => {
  process.stdout.write("\033c");
  console.clear();
  console.log("Body");
  console.log("====");
  console.log(req.body);
  console.log("====");
  next();
});

app.use("/portfolio", portfolioCotroller);
app.use("/strategy",strategyController);
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
