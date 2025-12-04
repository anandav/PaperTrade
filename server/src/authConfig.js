const msal = require('@azure/msal-node');

let pcaInstance = null;

function getPca() {
    if (!pcaInstance) {
        // Get config from global.appConfig which is set by ConfigLoader
        const appConfig = global.appConfig;

        if (!appConfig) {
            throw new Error('Application config not initialized. Make sure ConfigLoader runs before accessing B2C auth.');
        }

        const config = {
            auth: {
                clientId: appConfig.b2cClientId,
                authority: `https://aditirevathianand.b2clogin.com/aditirevathianand.onmicrosoft.com/${appConfig.b2cSigninPolicyName}`,
                authorityPasswordReset: `https://aditirevathianand.b2clogin.com/aditirevathianand.onmicrosoft.com/${appConfig.b2cPasswordResetPolicyName || appConfig.b2cSigninPolicyName}`,
                clientSecret: appConfig.b2cClientSecret,
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

        pcaInstance = new msal.ConfidentialClientApplication(config);
    }

    return pcaInstance;
}

// Export a getter object that returns the pca instance lazily
module.exports = {
    get pca() {
        return getPca();
    }
};
