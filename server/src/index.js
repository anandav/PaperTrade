const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const strategyController = require("./controller/strategycontroller");
const portfolioCotroller = require("./controller/portfoliocotroller");
const tradeController = require("./controller/tradecontroller");
const ssoAuthController = require("./controller/ssoauthcontroller");
const dataProvider = require("./dataprovidercontroller/index");
const authController = require("./controller/authcontroller");
const auth = require("./middleware/auth");
const logger = require("./common/logs");
const myenv = process.env;
const port = process.env.PORT || 9090;
const enable_dataapi = process.env.ENABLE_DATAAPI || "true";
const conn_string = process.env.DBCONNECTIONSTRING;
const jwt_secret = process.env.JWT_SECRET;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

logger.info("port:", port);
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Auth routes
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);

// SSO Auth routes
app.get("/api/auth/sso", ssoAuthController.login);
app.get("/api/auth/sso/callback", ssoAuthController.callback);

app.use("/strategy", auth, strategyController);
app.use("/portfolio", auth, portfolioCotroller);
app.use("/trade", auth, tradeController);

app.get('/', function (req, res) {
    res.redirect("/api-docs");
});

if (enable_dataapi == 'true') {
    app.use("/data", dataProvider);
} else {
    app.use("/data", (req, res) => {
        res.status(404).json({ "error": "Data endpoint is disabled" })
    });
}

if (conn_string) {
    mongoose
        .connect(conn_string)
        .then(() => logger.info("MongoDB connected"))
        .catch((err) => logger.error(err));
} else {
    logger.error("Empty connnection string!")
}

app.listen(port, (x) => {
    logger.info("Service Started");
});



