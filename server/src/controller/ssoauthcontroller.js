
const { pca } = require('../authConfig');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const ApiError = require('../common/ApiError');

exports.login = async (req, res, next) => {
    try {
        const authCodeUrlParameters = {
            scopes: [process.env.B2C_CLIENT_ID, "openid", "profile", "email"],
            redirectUri: "http://localhost:9090/auth/sso/callback",
        };

        if (req.query.domain_hint) {
            authCodeUrlParameters.extraQueryParameters = { domain_hint: req.query.domain_hint };
        }

        const response = await pca.getAuthCodeUrl(authCodeUrlParameters);
        res.redirect(response);
    } catch (error) {
        next(new ApiError(500, `SSO Login Error: ${error.message}`));
    }
};

exports.callback = async (req, res, next) => {
    try {
        const tokenRequest = {
            code: req.query.code,
            scopes: [process.env.B2C_CLIENT_ID, "openid", "profile", "email"],
            redirectUri: "http://localhost:9090/auth/sso/callback"
        };

        const response = await pca.acquireTokenByCode(tokenRequest);
        if (!response || !response.account) {
            throw new ApiError(400, 'Invalid SSO response or missing account information.');
        }

        let user = await User.findOne({ ssoId: response.account.homeAccountId });

        if (!user) {
            const newUser = new User({
                ssoId: response.account.homeAccountId,
                email: response.account.username,
                username: response.account.name,
            });
            await newUser.save();
            user = newUser;
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.redirect(`http://localhost:8080/?token=${token}`);

    } catch (error) {
        // Pass the error to the global error handler
        next(new ApiError(500, `SSO Callback Error: ${error.message}`));
    }
};
