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

reviewSchema.index({ serviceProvider: 1, user: 1 }, { unique: true }); // Ensure no duplication by users

reviewSchema.statics.calcAverageRatings = async function (serviceProviderId) {
  const stats = await this.aggregate([
    {
      $match: { serviceProvider: serviceProviderId },
    },
    {
      $group: {
        _id: '$serviceProvider',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await ServiceProvider.findByIdAndUpdate(serviceProviderId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await ServiceProvider.findByIdAndUpdate(serviceProviderId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.serviceProvider);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.review.constructor.calcAverageRatings(this.review.tour);
});

//--

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
