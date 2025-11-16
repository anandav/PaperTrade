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
// const authController = require("./controller/authcontroller");
const auth = require("./middleware/auth");
const logger = require("./common/logs");
const ApiError = require('./common/ApiError');
const errorHandler = require('./middleware/errorHandler');
const ConfigLoader = require('./configLoader');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Async initialization function
async function startServer() {
    try {
        // Load configuration from Key Vault or .env
        const configLoader = new ConfigLoader();
        const config = await configLoader.initialize();

        const port = config.port;
        const enable_dataapi = config.enableDataApi;
        const conn_string = config.dbConnectionString;
        const jwt_secret = config.jwtSecret;

        logger.info("port:", port);
        logger.info("enable_dataapi:", enable_dataapi);
        logger.info("conn_string:", conn_string ? "Provided" : "Not Provided");
        logger.info("jwt_secret:", jwt_secret ? "Provided" : "Not Provided");

        // Make config globally available for other modules
        global.appConfig = config;

        app.use(express.json());
        app.use(cors());
        app.use(helmet());

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        // // Auth routes
        // app.post("/auth/register", authController.register);
        // app.post("/auth/login", authController.login);

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

        // Connect to MongoDB
        if (conn_string) {
            await mongoose.connect(conn_string);
            logger.info("MongoDB connected");
        } else {
            logger.error("Empty connection string!");
            throw new Error("Database connection string not provided");
        }

        // Start the server
        app.listen(port, () => {
            logger.info(`Service Started on port ${port}`);
            logger.info(`Environment: ${config.nodeEnv}`);
        });

    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
}

// Start the server
startServer();
