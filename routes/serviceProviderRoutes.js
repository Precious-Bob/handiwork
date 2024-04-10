const express = require('express');
const authController = require('../controllers/authController');
const serviceProviderController = require('../controllers/serviceProviderController');
const router = express.Router();

// Service provider doesn't have its own jwt
// router.get(
//   '/me',
//   serviceProviderController.getMe,
//   serviceProviderController.getServiceProvider
// );

router.use(authController.protect);

router
  .route('/')
  .post(serviceProviderController.createServiceProvider)
  .get(serviceProviderController.getAllServiceProviders);

router
  .route('/:id')
  .get(serviceProviderController.getServiceProvider)
  .patch(serviceProviderController.updateServiceProvider)
  .delete(serviceProviderController.deleteServiceProvider);

module.exports = router;
