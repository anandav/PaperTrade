
const logger = require("./common/logs");
const dotenv = require('dotenv');
const path = require('path');

logger.info("NODE_ENV:", process.env.NODE_ENV); 
logger.info("__dirname:", __dirname);
logger.info("path.resolve:", path.resolve(__dirname, '../.env'));
if (process.env.NODE_ENV !== 'production') {

  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

module.exports = {
  port: process.env.PORT || 9090,
  enableDataApi: String(process.env.ENABLE_DATAAPI).toLowerCase() === 'true',
  dbConnectionString: process.env.DBCONNECTIONSTRING,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:8080',
};
