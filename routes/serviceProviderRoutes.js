const express = require('express');
const authController = require('../controllers/authController');
const serviceProviderController = require('../controllers/serviceProviderController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

// Service provider doesn't have its own jwt
// router.get(
//   '/me',
//   serviceProviderController.getMe,
//   serviceProviderController.getServiceProvider
// );
router.use('/:serviceProviderId/reviews', reviewRouter);

router
  .route('/')
  .post(serviceProviderController.createServiceProvider)
  .get(
    authController.protect,
    authController.authorize('admin'),
    serviceProviderController.getAllServiceProviders
  );

router.use(authController.protect);

router
  .route('/:id')
  .get(serviceProviderController.getServiceProvider)
  .patch(serviceProviderController.updateServiceProvider)
  .delete(serviceProviderController.deleteServiceProvider);

module.exports = router;
