const express = require('express');
const authController = require('../controllers/authController');
const serviceProviderController = require('../controllers/serviceProviderController');
const router = express.Router();

router
  .route('/')
  .post(serviceProviderController.createServiceProvider)
  .get(serviceProviderController.getAllServiceProviders);

router
  .route('/:serviceProviderId')
  .get(serviceProviderController.getServiceProviderById);

module.exports = router;
