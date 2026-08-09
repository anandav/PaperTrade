
const { pca, getAuthority } = require('../ciamAuthConfig');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const ApiError = require('../common/ApiError');

const CIAM_SCOPES = ["openid", "profile", "email", "https://graph.microsoft.com/User.ReadWrite"];

async function syncProfileFromGraph(accessToken) {
    const { data } = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { $select: 'givenName,surname,displayName' },
    });

    const givenName = data.givenName || '';
    const surname = data.surname || '';
    const desiredDisplayName = `${givenName} ${surname}`.trim();

    if (desiredDisplayName && data.displayName !== desiredDisplayName) {
        await axios.patch('https://graph.microsoft.com/v1.0/me',
            { displayName: desiredDisplayName },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
    }

    return { givenName, surname };
}

exports.login = async (req, res, next) => {
    try {
        const appConfig = global.appConfig;
        const authCodeUrlParameters = {
            scopes: CIAM_SCOPES,
            redirectUri: appConfig.ciamRedirectUri,
            authority: getAuthority(),
        };

        const response = await pca.getAuthCodeUrl(authCodeUrlParameters);
        res.redirect(response);
    } catch (error) {
        next(new ApiError(500, `CIAM Login Error: ${error.message}`));
    }
};

exports.logout = async (req, res, next) => {
    try {
        const appConfig = global.appConfig;
        const tenantName = appConfig.ciamTenantName;
        const logoutUri = encodeURIComponent(appConfig.clientUri);

        const logoutUrl = `https://${tenantName}.ciamlogin.com/${tenantName}.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=${logoutUri}`;

        console.log('Redirecting to CIAM Logout:', logoutUrl);
        res.redirect(logoutUrl);
    } catch (error) {
        next(new ApiError(500, `CIAM Logout Error: ${error.message}`));
    }
};

exports.callback = async (req, res, next) => {
    const appConfig = global.appConfig;
    const errorDescription = req.query.error_description || req.query.error;

    if (errorDescription) {
        console.log('CIAM Callback Error:', errorDescription);
        return res.redirect(`${appConfig.clientUri}?error_description=${encodeURIComponent(errorDescription)}`);
    }

    try {
        const tokenRequest = {
            code: req.query.code,
            scopes: CIAM_SCOPES,
            redirectUri: appConfig.ciamRedirectUri,
            authority: getAuthority()
        };

        const response = await pca.acquireTokenByCode(tokenRequest);
        if (!response || !response.account) {
            throw new ApiError(400, 'Invalid CIAM response or missing account information.');
        }

        console.log('idTokenClaims:', JSON.stringify(response.idTokenClaims, null, 2));

        let firstName = response.idTokenClaims.given_name || '';
        let lastName = response.idTokenClaims.family_name || '';
        try {
            const profile = await syncProfileFromGraph(response.accessToken);
            firstName = profile.givenName || firstName;
            lastName = profile.surname || lastName;
        } catch (graphError) {
            console.error('CIAM Graph profile sync failed:', graphError.message);
        }

        const email = (response.idTokenClaims.emails && response.idTokenClaims.emails[0]) || response.idTokenClaims.email || `${response.account.homeAccountId}@papertrade.com`;

        let user = await User.findOne({ ssoId: response.account.homeAccountId });
        if (!user) {
            // Re-link a pre-existing (e.g. B2C) account by email instead of creating a duplicate
            user = await User.findOne({ email });
        }

        let isNewlyCreated = false;
        if (!user) {
            try {
                const newUser = new User({
                    ssoId: response.account.homeAccountId,
                    email,
                    username: `${response.account.homeAccountId}-user`,
                    firstName,
                    lastName,
                });
                await newUser.save();
                user = newUser;
                isNewlyCreated = true;
            } catch (saveError) {
                // Lost a race with a concurrent request that just created/linked this same user
                if (saveError.code !== 11000) {
                    throw saveError;
                }
                user = await User.findOne({ ssoId: response.account.homeAccountId }) || await User.findOne({ email });
                if (!user) {
                    throw saveError;
                }
            }
        }

        if (!isNewlyCreated) {
            user.ssoId = response.account.homeAccountId;
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
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
        console.error('CIAM Final Callback Error:', error);
        next(new ApiError(500, `CIAM Callback Error: ${error.message}`));
    }
};
