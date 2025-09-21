require('express-async-errors'); // Must be the first import
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const strategyController = require("./controller/strategycontroller");
const portfolioCotroller = require("./controller/portfoliocotroller");
const tradeController = require("./controller/tradecontroller");

const dataProvider = require("./dataprovidercontroller/index");
const authController = require("./controller/authcontroller");
const auth = require("./middleware/auth");
const logger = require("./common/logs");
const ApiError = require('./common/ApiError');
const errorHandler = require('./middleware/errorHandler');
const myenv = process.env;
const port = process.env.PORT || 9090;
const enable_dataapi = String(process.env.ENABLE_DATAAPI).toLowerCase() === "true";
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

const b2cAuthRoutes = require("./routes/b2cauth.js");



// B2C Auth routes
app.use("/auth/b2c", b2cAuthRoutes);

app.use("/strategy", auth, strategyController);
app.use("/portfolio", auth, portfolioCotroller);
app.use("/trade", auth, tradeController);

app.get('/', function (req, res) {
    res.redirect("/api-docs");
});

if (enable_dataapi) {
    app.use("/data", dataProvider);
} else {
    app.use("/data", (req, res) => {
        res.status(404).json({ "error": "Data endpoint is disabled" })
    });
}

// Handle 404 errors - this should be after all routes
app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found'));
});

// Global error handler - this must be the last middleware
app.use(errorHandler);

if (conn_string) {
    mongoose
        .connect(conn_string)
        .then(() => logger.info("MongoDB connected"))
        .catch((err) => {
            // Instead of just logging, we can now throw an error that will be caught
            // by our global handler, though the app will likely exit on DB connection failure.
            // For now, we'll keep logging it, but this could be improved.
            logger.error("MongoDB connection error:", err)
            // We could throw here, but it would stop the app from starting.
        });
} else {
    logger.error("Empty connnection string!")
}

app.listen(port, (x) => {
    logger.info("Service Started");
});