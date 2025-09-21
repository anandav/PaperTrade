
const express = require('express');
const router = express.Router();
const b2cAuthController = require('../controller/b2cauthcontroller');

router.get('/login', b2cAuthController.login);
router.get('/resetpassword', b2cAuthController.resetPassword);
router.get('/callback', b2cAuthController.callback);

module.exports = router;
