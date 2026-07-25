
const { pca, getAuthority } = require('../authConfig');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const ApiError = require('../common/ApiError');

exports.login = async (req, res, next) => {
    try {
        const appConfig = global.appConfig;
        const authCodeUrlParameters = {
            scopes: ["openid", "profile", "email"],
            redirectUri: appConfig.b2cRedirectUri,
            authority: getAuthority(appConfig.b2cSigninPolicyName),
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
        if (!appConfig.b2cPasswordResetPolicyName) {
            console.warn('B2C_PASSWORD_RESET_POLICY_NAME is not configured. Falling back to default sign-in policy, which might fail for password resets.');
        }

        const authCodeUrlParameters = {
            scopes: ["openid", "profile", "email"],
            redirectUri: appConfig.b2cRedirectUri,
            authority: getAuthority(appConfig.b2cPasswordResetPolicyName),
        };

        console.log('Generating Auth Code URL for Password Reset with authority:', authCodeUrlParameters.authority);
        const response = await pca.getAuthCodeUrl(authCodeUrlParameters);
        res.redirect(response);
    } catch (error) {
        console.error('B2C Reset Password Error:', error);
        next(new ApiError(500, `B2C Reset Password Error: ${error.message}`));
    }
};

exports.logout = async (req, res, next) => {
    try {
        const appConfig = global.appConfig;
        const tenantName = appConfig.b2cTenantName;
        const policyName = appConfig.b2cSigninPolicyName;
        const logoutUri = encodeURIComponent(appConfig.clientUri);
        
        const logoutUrl = `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${policyName}/oauth2/v2.0/logout?post_logout_redirect_uri=${logoutUri}`;
        
        console.log('Redirecting to B2C Logout:', logoutUrl);
        res.redirect(logoutUrl);
    } catch (error) {
        next(new ApiError(500, `B2C Logout Error: ${error.message}`));
    }
};

exports.callback = async (req, res, next) => {
    const appConfig = global.appConfig;
    const errorDescription = req.query.error_description || req.query.error;

    if (errorDescription) {
        console.log('B2C Callback Error:', errorDescription);
        if (errorDescription.includes('AADB2C90118')) {
            // Redirect to the reset password flow
            const resetPasswordUrl = `/auth/b2c/resetpassword`;
            console.log('Redirecting to Password Reset:', resetPasswordUrl);
            return res.redirect(resetPasswordUrl);
        }
        if (errorDescription.includes('AADB2C90091')) {
            console.log('User cancelled B2C operation');
            return res.redirect(`${appConfig.clientUri}`);
        }
        return res.redirect(`${appConfig.clientUri}?error_description=${encodeURIComponent(errorDescription)}`);
    }

    try {
        // After password reset, B2C returns 'tfp' or 'p' parameter in query for policy name
        const policy = req.query.tfp || req.query.p || appConfig.b2cSigninPolicyName;
        const authority = getAuthority(policy);

        console.log('B2C Callback using Policy:', policy);
        console.log('B2C Callback using Authority:', authority);

        const tokenRequest = {
            code: req.query.code,
            scopes: ["openid", "profile", "email"],
            redirectUri: appConfig.b2cRedirectUri,
            authority: authority
        };

        const response = await pca.acquireTokenByCode(tokenRequest);
        if (!response || !response.account) {
            throw new ApiError(400, 'Invalid B2C response or missing account information.');
        }

        let user = await User.findOne({ ssoId: response.account.homeAccountId });

        console.log('idTokenClaims:', JSON.stringify(response.idTokenClaims, null, 2));
        const firstName = response.idTokenClaims.given_name || response.idTokenClaims.name || '';
        const lastName = response.idTokenClaims.family_name || '';

        if (!user) {
            const newUser = new User({
                ssoId: response.account.homeAccountId,
                email: (response.idTokenClaims.emails && response.idTokenClaims.emails[0]) || response.idTokenClaims.email || `${response.account.homeAccountId}@papertrade.com`,
                username: response.idTokenClaims.name || `${response.account.homeAccountId}-user`,
                firstName,
                lastName,
            });
            await newUser.save();
            user = newUser;
        } else {
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = (response.idTokenClaims.emails && response.idTokenClaims.emails[0]) || response.idTokenClaims.email || user.email;
            await user.save();
        }

        const claims = {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
        const token = jwt.sign(claims, appConfig.jwtSecret, { expiresIn: '1h' });
        const refreshToken = jwt.sign(
            { _id: user._id, type: 'refresh' },
            appConfig.jwtSecret,
            { expiresIn: '7d' }
        );
        const q = new URLSearchParams({
            token,
            refreshToken,
        });
        res.redirect(`${appConfig.clientUri}/?${q.toString()}`);

    } catch (error) {
        console.error('B2C Final Callback Error:', error);
        next(new ApiError(500, `B2C Callback Error: ${error.message}`));
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const appConfig = global.appConfig;
        const refreshToken = req.body?.refreshToken;
        if (!refreshToken) {
            throw new ApiError(400, 'Refresh token is required.');
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, appConfig.jwtSecret);
        } catch (e) {
            throw new ApiError(401, 'Invalid or expired refresh token.');
        }

        if (decoded.type !== 'refresh' || !decoded._id) {
            throw new ApiError(401, 'Invalid refresh token.');
        }

        const user = await User.findOne({ _id: decoded._id });
        if (!user || user.status === 'inactive') {
            throw new ApiError(401, 'User not found or inactive.');
        }

        const claims = {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
        const token = jwt.sign(claims, appConfig.jwtSecret, { expiresIn: '1h' });
        const nextRefreshToken = jwt.sign(
            { _id: user._id, type: 'refresh' },
            appConfig.jwtSecret,
            { expiresIn: '7d' }
        );

        res.json({ token, refreshToken: nextRefreshToken });
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, `Refresh token error: ${error.message}`));
    }
};
