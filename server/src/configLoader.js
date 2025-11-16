const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");
const logger = require("./common/logs");

class ConfigLoader {
  constructor() {
    this.config = {};
    this.isKeyVaultEnabled = false;
    this.secretClient = null;
  }

  async initialize() {
    const keyVaultUrl = process.env.AZURE_KEY_VAULT_URL;
    const isProduction = process.env.NODE_ENV === 'production';

    if (keyVaultUrl && isProduction) {
      logger.info("Using Azure Key Vault for configuration");
      this.isKeyVaultEnabled = true;

      try {
        const credential = new DefaultAzureCredential();
        this.secretClient = new SecretClient(keyVaultUrl, credential);
        await this.loadFromKeyVault();
      } catch (error) {
        logger.error("Failed to initialize Azure Key Vault:", error);
        throw new Error("Key Vault initialization failed");
      }
    } else {
      logger.info("Using .env file for configuration");
      this.loadFromEnv();
    }

    return this.config;
  }

  async loadFromKeyVault() {
    const secretMappings = {
      'DBCONNECTIONSTRING': 'dbConnectionString',
      'JWTSECRET': 'jwtSecret',
      'ENABLEDATAAPI': 'enableDataApi',
      'ENABLEDEMO': 'enableDemo',
      'CACHEDURATION': 'cacheDuration',
      'PORT': 'port',
      'CLIENTURI': 'clientUri',

      // NSE 
      'NSEINDICESLISTAPI': 'nseIndicesListApi',
      'NSEINDICESFUTURESAPI': 'nseIndicesFuturesApi',
      'NSEINDICESOPTIONSAPI': 'nseIndicesOptionsApi',
      'NSEMKTLOTS': 'nseMktLots',
      'NSEEQUITIESAPI': 'nseEquitiesApi',
      'NSEEQUITIESFUTURESLISTAPI': 'nseEquitiesFuturesListApi',
      'NSEEQUITIESFUTURESAPI': 'nseEquitiesFuturesApi',
      'NSEEQUITIESOPTIONSAPI': 'nseEquitiesOptionsApi',
      'NSEEQUITIESMETAINFOAPI': 'nseEquitiesMetaInfoApi',
      'NSECURRENCYFUTURESLISTAPI': 'nseCurrencyFuturesListApi',
      'NSECURRENCYFUTURESLISTAPI2': 'nseCurrencyFuturesListApi2',
      'NSECURRENCYOPTIONSAPI': 'nseCurrencyOptionsApi',

      // CBOE
      'CBOELISTAPI': 'cboeListApi',
      'CBOEEQUITIESAPI': 'cboeEquitiesApi',

      // B2C 
      'B2CTENANTID': 'b2cTenantId',
      'B2CCLIENTID': 'b2cClientId',
      'B2CPOLICYNAME': 'b2cPolicyName',
      'B2CIDENTITYMETADATA': 'b2cIdentityMetadata',
      'B2CSIGNINPOLICYNAME': 'b2cSigninPolicyName',
      'B2CTENANTNAME': 'b2cTenantName',
      'B2CCLIENTSECRET': 'b2cClientSecret',
      'B2CREDIRECTURI': 'b2cRedirectUri',
    };

    for (const [secretName, configKey] of Object.entries(secretMappings)) {
      try {
        const secret = await this.secretClient.getSecret(secretName);
        this.config[configKey] = secret.value;
      } catch (error) {
        if (error.statusCode === 404) {
          logger.warn(`Secret ${secretName} not found in Key Vault`);
        } else {
          logger.error(`Error fetching secret ${secretName}:`, error.message);
        }
      }
    }

    this.config.port = parseInt(this.config.port || '9090', 10);
    this.config.enableDataApi = String(this.config.enableDataApi || 'false').toLowerCase() === 'true';
    this.config.enableDemo = String(this.config.enableDemo || 'false').toLowerCase() === 'true';
    this.config.cacheDuration = parseInt(this.config.cacheDuration || '10', 10);
    this.config.nodeEnv = 'production';
  }

  loadFromEnv() {
    this.config = {
      port: parseInt(process.env.PORT || '9090', 10),
      enableDataApi: String(process.env.ENABLE_DATAAPI || 'false').toLowerCase() === 'true',
      enableDemo: String(process.env.ENABLE_DEMO || 'false').toLowerCase() === 'true',
      dbConnectionString: process.env.DBCONNECTIONSTRING,
      jwtSecret: process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV || 'development',
      clientUri: process.env.CLIENT_URI || 'http://localhost:8080',
      cacheDuration: parseInt(process.env.CACHE_DURATION || '10', 10),

      // NSE 
      nseIndicesListApi: process.env.NSE_INDICES_LIST_API,
      nseIndicesFuturesApi: process.env.NSE_INDICES_FUTURES_API,
      nseIndicesOptionsApi: process.env.NSE_INDICES_OPTIONS_API,
      nseMktLots: process.env.NSE_MKT_LOTS,
      nseEquitiesApi: process.env.NSE_EQUITIES_API,
      nseEquitiesFuturesListApi: process.env.NSE_EQUITIES_FUTURES_LIST_API,
      nseEquitiesFuturesApi: process.env.NSE_EQUITIES_FUTURES_API,
      nseEquitiesOptionsApi: process.env.NSE_EQUITIES_OPTIONS_API,
      nseEquitiesMetaInfoApi: process.env.NSE_EQUITIES_META_INFO_API,
      nseCurrencyFuturesListApi: process.env.NSE_CURRENCY_FUTURES_LIST_API,
      nseCurrencyFuturesListApi2: process.env.NSE_CURRENCY_FUTURES_LIST_API2,
      nseCurrencyOptionsApi: process.env.NSE_CURRENCY_OPTIONS_API,

      // CBOE 
      cboeListApi: process.env.CBOE_LIST_API,
      cboeEquitiesApi: process.env.CBOE_EQUITIES_API,

      // B2C 
      b2cTenantId: process.env.B2C_TENANT_ID,
      b2cClientId: process.env.B2C_CLIENT_ID,
      b2cPolicyName: process.env.B2C_POLICY_NAME,
      b2cIdentityMetadata: process.env.B2C_IDENTITY_METADATA,
      b2cSigninPolicyName: process.env.B2C_SIGNIN_POLICY_NAME,
      b2cTenantName: process.env.B2C_TENANT_NAME,
      b2cClientSecret: process.env.B2C_CLIENT_SECRET,
      b2cRedirectUri: process.env.B2C_REDIRECT_URI,
    };
  }

  getConfig() {
    return this.config;
  }
}

module.exports = ConfigLoader;
