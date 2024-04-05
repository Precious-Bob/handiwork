const mongoose = require('mongoose');
const User = require('./userModel');
const ServiceProvider = require('../models/serviceProviderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    serviceProvider: {
      type: mongoose.Schema.ObjectId,
      ref: 'ServiceProvider',
      required: [true, 'Review must belong to a serviceProvider.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName',
  });
  next();
});

reviewSchema.pre('save', async function (next) {
  const userExists = await User.exists({ _id: this.user });
  const serviceProviderExists = await ServiceProvider.exists({
    _id: this.serviceProvider,
  });

  if (!userExists || !serviceProviderExists) {
    return next(
      new AppError('Please provide a valid user or serviceProvider id', 400)
    );
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
