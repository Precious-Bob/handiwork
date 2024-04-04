const mongoose = require('mongoose');
const User = require('./userModel');

const serviceProviderSchema = new mongoose.Schema({
  ...User.schema.obj, // Inherits fields from User model
  services: [
    {
      name: String,
      description: String,
      category: String,
      rates: {
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
});

const ServiceProvider = mongoose.model(
  'ServiceProvider',
  serviceProviderSchema
);
module.exports = ServiceProvider;