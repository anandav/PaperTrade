const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const strategyController = require("./controller/strategycontroller");
const portfolioCotroller = require("./controller/portfoliocotroller");
const tradeController = require("./controller/tradecontroller");
const dataProvider = require("./dataprovidercontroller/index");
const port = process.env.PORT || 9090;


app.use(express.json());
//app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use(helmet());

app.use("/", (req, res, next) => {
  process.stdout.write("\033c");

  next();
});
app.use("/strategy", strategyController);
app.use("/portfolio", portfolioCotroller);
app.use("/trade", tradeController);
if (process.env.ENABLE_DATAAPI == 'true') {
  app.use("/data", dataProvider);
} else {
 
  
  app.use("/data", (req, res) => {
    res.status(404).json({ "error": "Data endpoint is disabled" })
  });
}

app.use("/", express.static('public'));

mongoose.connect(
  process.env.DBCONNECTIONSTRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (x) => {
    console.log(x);
  }
);















//app.use(require("./route"));
app.listen(port, function () {
});



