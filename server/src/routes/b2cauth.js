
const express = require('express');
const router = express.Router();
const b2cAuthController = require('../controller/b2cauthcontroller');
const ciamAuthController = require('../controller/ciamauthcontroller');

function activeAuthController() {
    return global.appConfig.authProvider === 'ciam' ? ciamAuthController : b2cAuthController;
}

router.get('/login', (req, res, next) => activeAuthController().login(req, res, next));
router.get('/logout', (req, res, next) => activeAuthController().logout(req, res, next));
router.get('/resetpassword', b2cAuthController.resetPassword);
router.get('/callback', b2cAuthController.callback);
router.post('/refresh', b2cAuthController.refresh);

module.exports = router;
