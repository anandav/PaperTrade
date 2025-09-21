
const { pca } = require('../authConfig');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const ApiError = require('../common/ApiError');

exports.login = async (req, res, next) => {
    try {
        const authCodeUrlParameters = {
            scopes: ["openid", "profile", "email"],
            redirectUri: "http://localhost:9090/auth/b2c/callback",
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
        const authCodeUrlParameters = {
            scopes: ["openid", "profile", "email"],
            redirectUri: "http://localhost:9090/auth/b2c/callback",
            authority: pca.config.auth.authorityPasswordReset,
        };

        const response = await pca.getAuthCodeUrl(authCodeUrlParameters);
        res.redirect(response);
    } catch (error) {
        next(new ApiError(500, `B2C Reset Password Error: ${error.message}`));
    }
};

exports.callback = async (req, res, next) => {
    if (req.query.error_description) {
        return res.redirect(`http://localhost:8080/login?error_description=${req.query.error_description}`);
    }

    try {
        const tokenRequest = {
            code: req.query.code,
            scopes: ["openid", "profile", "email"],
            redirectUri: "http://localhost:9090/auth/b2c/callback"
        };

        const response = await pca.acquireTokenByCode(tokenRequest);
        if (!response || !response.account) {
            throw new ApiError(400, 'Invalid B2C response or missing account information.');
        }

        let user = await User.findOne({ ssoId: response.account.homeAccountId });

        if (!user) {
            const newUser = new User({
                ssoId: response.account.homeAccountId,
                email: response.idTokenClaims.email,
                username: response.idTokenClaims.name,
            });
            await newUser.save();
            user = newUser;
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.redirect(`http://localhost:8080/?token=${token}`);

    } catch (error) {
        next(new ApiError(500, `B2C Callback Error: ${error.message}`));
    }
};
