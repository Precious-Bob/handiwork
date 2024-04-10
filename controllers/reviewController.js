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


exports.getAllReviews = factory.getAll(Review)

exports.getReview = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
