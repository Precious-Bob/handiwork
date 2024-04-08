const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(authController.protect, reviewController.createReview)
  .get(reviewController.getAllReviews);

router
  .route('/:id')
  .get(reviewController.getReviewById)
  .delete(reviewController.deleteReview);

module.exports = router;
