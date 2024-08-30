const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const strategyController = require("./controller/strategycontroller");
const portfolioCotroller = require("./controller/portfoliocotroller");
const tradeController = require("./controller/tradecontroller");
const dataProvider = require("./dataprovidercontroller/index");
const logger = require("./common/logs");
const port = process.env.PORT || 9090;
const enable_dataapi = process.env.ENABLE_DATAAPI || "true";
const conn_string = process.env.DBCONNECTIONSTRING;
console.log("Connection string", conn_string);

logger.info("port:", port);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use("/strategy", strategyController);
app.use("/portfolio", portfolioCotroller);
app.use("/trade", tradeController);
var options = {
  index: "index.html"
};

//  app.use("/", options);
app.get('/', function(req, res){
  res.sendFile( __dirname + "/index.html"  );
});
// app.use("/", express.static('public'));

//app.use(express.urlencoded({extended : true}));

if (enable_dataapi == 'true') {
  app.use("/data", dataProvider);
} else {
  app.use("/data", (req, res) => {
    res.status(404).json({ "error": "Data endpoint is disabled" })
  });
}
if (conn_string) {
  mongoose.connect(
    conn_string,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (x) => {
	    if(!x){
      		logger.info(x);
		logger.info("DB connected...");
	    }
    }
  );
} else {
  logger.error("Empty connnection string!")
}

app.listen(port, (x) => {
  logger.info("Service Started...");
});



