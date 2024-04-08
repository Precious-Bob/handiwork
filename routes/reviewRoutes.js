const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(authController.protect, reviewController.createReview)
  .get(reviewController.getAllReviews);

router
  .route('/:reviewId')
  .get(reviewController.getReviewById)
  .post(reviewController.deleteReview);

module.exports = router;
