const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .post(
    authController.authorize('user'),
    reviewController.setServiceProviderId,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.authorize('admin', 'user'),
    reviewController.updateReview
  )
  .delete(
    authController.authorize('admin', 'user'),
    reviewController.deleteReview
  );

module.exports = router;
