const express = require('express');
const authController = require('../controllers/authController');
const serviceProviderController = require('../controllers/serviceProviderController');
const router = express.Router();

router
  .route('/')
  .post(authController.protect, serviceProviderController.createServiceProvider)
  .get(serviceProviderController.getAllServiceProviders);

router
  .route('/:id')
  .get(authController.protect, serviceProviderController.getServiceProvider)
  .patch(
    authController.protect,
    serviceProviderController.updateServiceProvider
  )
  .delete(
    authController.protect,
    serviceProviderController.deleteServiceProvider
  );

module.exports = router;
