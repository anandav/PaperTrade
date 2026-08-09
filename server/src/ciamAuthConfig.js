const msal = require('@azure/msal-node');

let pcaInstance = null;

function getPca() {
    if (!pcaInstance) {
        const appConfig = global.appConfig;

        if (!appConfig) {
            throw new Error('Application config not initialized. Make sure ConfigLoader runs before accessing CIAM auth.');
        }

        const tenantName = appConfig.ciamTenantName;

        const config = {
            auth: {
                clientId: appConfig.ciamClientId,
                authority: `https://${tenantName}.ciamlogin.com/${tenantName}.onmicrosoft.com/v2.0`,
                clientSecret: appConfig.ciamClientSecret,
                knownAuthorities: [`${tenantName}.ciamlogin.com`],
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

module.exports = {
    get pca() {
        return getPca();
    },
    getAuthority() {
        const appConfig = global.appConfig;
        const tenantName = appConfig.ciamTenantName;
        return `https://${tenantName}.ciamlogin.com/${tenantName}.onmicrosoft.com/v2.0`;
    }
};
