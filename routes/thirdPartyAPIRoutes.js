const express = require('express');
const thirdPartyAPIController = require('../controllers/thirdPartyAPIController');

const router = express.Router();

router.route('/getPlaces').post(thirdPartyAPIController.getPlaces);
router.route('/getMyPlace').post(thirdPartyAPIController.getMyPlace);


module.exports = router;