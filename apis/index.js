const express = require('express');
const router = express.Router();
const { AppUninstall } = require('../controllers/shopifyController');

router.post('/uninstall', express.json(), AppUninstall);

module.exports = router;