const logger = require("./common/logs");
const path = require('path');

logger.info("NODE_ENV:", process.env.NODE_ENV);
logger.info("__dirname:", __dirname);
logger.info("path.resolve:", path.resolve(__dirname, '../.env'));

// Load .env file only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  try {
    const dotenv = require('dotenv');
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
  } catch (error) {
    logger.warn("dotenv not available, skipping .env file loading");
  }
}

module.exports = {
  port: process.env.PORT || 9090,
  enableDataApi: String(process.env.ENABLE_DATAAPI || 'false').toLowerCase() === 'true',
  dbConnectionString: process.env.DBCONNECTIONSTRING,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUri: process.env.CLIENT_URI || 'http://localhost:8080',
};
