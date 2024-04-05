const mongoose = require('mongoose');
const User = require('./userModel');

const serviceProviderSchema = new mongoose.Schema(
  {
    ...User.schema.obj, // Inherits fields from User model
    services: [
      {
        name: String,
        description: String,
        category: String,
        Price: {
          type: {
            type: String,
            default: 'fixed',
          },
          value: Number,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
serviceProviderSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'serviceProvider',
  localField: '_id',
});

const ServiceProvider = mongoose.model(
  'ServiceProvider',
  serviceProviderSchema
);
module.exports = ServiceProvider;
