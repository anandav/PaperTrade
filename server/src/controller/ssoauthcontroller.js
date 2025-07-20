
const { pca } = require('../authConfig');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const authCodeUrlParameters = {
        scopes: [process.env.B2C_CLIENT_ID, "openid", "profile","email"],
        redirectUri: "http://localhost:9090/auth/sso/callback",
    };
    console.log("Domain hint:", req.query.domain_hint);
    if (req.query.domain_hint) {
        authCodeUrlParameters.extraQueryParameters = { domain_hint: req.query.domain_hint };
    }

    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
};

exports.callback = (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: [process.env.B2C_CLIENT_ID, "openid", "profile","email"],
        redirectUri: "http://localhost:9090/auth/sso/callback",
    };

    pca.acquireTokenByCode(tokenRequest).then(async (response) => {
        console.log("SSO Callback Response:", response);
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

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '2m' });
        res.redirect(`http://localhost:8080/?token=${token}`);

    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
};
