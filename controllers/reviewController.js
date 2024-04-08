const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerfactory');

exports.createReview = catchAsync(async (req, res) => {
  console.log(req.user.id);
  // Allow nested review
  if (!req.body.serviceProvider)
    req.body.serviceProvider = req.params.serviceProviderId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await Review.create(req.body);
  return res.status(201).json({
    status: 'Success',
    data: review,
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.serviceProviderId)
    filter = { serviceProvider: req.params.serviceProviderId };
  const reviews = await Review.find(filter);
  if (!reviews) return next(new AppError('No review found!', 404));
  return res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: reviews,
  });
});

exports.getReviewById = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('No review found with that id!', 404));
  return res.status(200).json({
    status: 'Success',
    data: review,
  });
});

exports.deleteReview = factory.deleteOne(Review);
