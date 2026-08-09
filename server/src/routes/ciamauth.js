
const express = require('express');
const router = express.Router();
const ciamAuthController = require('../controller/ciamauthcontroller');

router.get('/callback', ciamAuthController.callback);

module.exports = router;
