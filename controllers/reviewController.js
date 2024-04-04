const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createReview = catchAsync(async (req, res) => {
  const review = await Review.create(req.body);
  return res.status(201).json({
    status: 'Success',
    data: review,
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  if (!reviews) return next(new AppError('No review found!', 404));
  return res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: reviews,
  });
});

exports.getReviewById = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return next(new AppError('No review found with that id!', 404));
  return res.status(200).json({
    status: 'Success',
    data: review,
  });
});
