const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Service provider must be associated with a user'],
  },
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
});

const ServiceProvider = mongoose.model(
  'ServiceProvider',
  serviceProviderSchema
);
module.exports = ServiceProvider;
