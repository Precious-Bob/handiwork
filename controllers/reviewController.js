const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerfactory');

exports.setServiceProviderId = (req, res, next) => {
  // Allow nested review
  if (!req.body.serviceProvider)
    req.body.serviceProvider = req.params.serviceProviderId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);

exports.getAllReviews = catchAsync(async (req, res, next) => {
 
  const reviews = await Review.find(filter);
  if (!reviews) return next(new AppError('No review found!', 404));
  return res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: reviews,
  });
});

exports.getReview = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
