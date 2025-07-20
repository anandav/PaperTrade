
const { pca } = require('../authConfig');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: "http://localhost:9090/api/auth/sso/callback",
    };

    if (req.query.idp_hint) {
        authCodeUrlParameters.extraQueryParameters = { idp_hint: req.query.idp_hint };
    }

    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
};

exports.callback = (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: "http://localhost:9090/api/auth/sso/callback",
    };

    pca.acquireTokenByCode(tokenRequest).then(async (response) => {
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
