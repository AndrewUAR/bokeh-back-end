const express = require('express');
const thirdPartyAPIController = require('../controllers/thirdPartyAPIController');

const router = express.Router();

router.route('/').post(thirdPartyAPIController.getData);

module.exports = router;