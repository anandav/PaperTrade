
const { pca } = require('../authConfig');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const ApiError = require('../common/ApiError');

exports.login = async (req, res, next) => {
    try {
        const appConfig = global.appConfig;
        const authCodeUrlParameters = {
            scopes: ["openid", "profile", "email"],
            redirectUri: appConfig.b2cRedirectUri,
            authority: pca.config.auth.authority,
        };

        const response = await pca.getAuthCodeUrl(authCodeUrlParameters);
        res.redirect(response);
    } catch (error) {
        next(new ApiError(500, `B2C Login Error: ${error.message}`));
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const appConfig = global.appConfig;
        const authCodeUrlParameters = {
            scopes: ["openid", "profile", "email"],
            redirectUri: appConfig.b2cRedirectUri,
            authority: pca.config.auth.authorityPasswordReset,
        };

        const response = await pca.getAuthCodeUrl(authCodeUrlParameters);
        res.redirect(response);
    } catch (error) {
        next(new ApiError(500, `B2C Reset Password Error: ${error.message}`));
    }
};

exports.callback = async (req, res, next) => {
    const appConfig = global.appConfig;

    if (req.query.error_description) {
        return res.redirect(`${appConfig.clientUri}/login?error_description=${req.query.error_description}`);
    }

    try {
        const tokenRequest = {
            code: req.query.code,
            scopes: ["openid", "profile", "email"],
            redirectUri: appConfig.b2cRedirectUri
        };

        const response = await pca.acquireTokenByCode(tokenRequest);
        if (!response || !response.account) {
            throw new ApiError(400, 'Invalid B2C response or missing account information.');
        }

        let user = await User.findOne({ ssoId: response.account.homeAccountId });

        if (!user) {
            const newUser = new User({
                ssoId: response.account.homeAccountId,
                email: response.idTokenClaims.email || `${response.account.homeAccountId}@papertrade.com`,
                username: response.idTokenClaims.name || `${response.account.homeAccountId}-user`,
            });
            await newUser.save();
            user = newUser;
        }

        const token = jwt.sign({ _id: user._id }, appConfig.jwtSecret, { expiresIn: '1h' });
        res.redirect(`${appConfig.clientUri}/?token=${token}`);

    } catch (error) {
        next(new ApiError(500, `B2C Callback Error: ${error.message}`));
    }
};
