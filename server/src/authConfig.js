const msal = require('@azure/msal-node');

const config = {
    auth: {
        clientId: process.env.B2C_CLIENT_ID,
        //authority: `https://login.microsoftonline.com/${process.env.B2C_TENANT_ID}`,
        authority: `https://aditirevathianand.b2clogin.com/aditirevathianand.onmicrosoft.com/${process.env.B2C_POLICY_NAME}`,
        clientSecret: process.env.B2C_CLIENT_SECRET, 
        knownAuthorities: ["aditirevathianand.b2clogin.com"],
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Info,
        }
    }
};

const pca = new msal.ConfidentialClientApplication(config);

module.exports = { pca };
