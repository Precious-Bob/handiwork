const express = require('express');
const authController = require('../controllers/authController');
const serviceProviderController = require('../controllers/serviceProviderController');
const router = express.Router();

router.route('/signup').post(authController.signup);

router.route('/').post(serviceProviderController.createServiceProvider);

module.exports = router;
