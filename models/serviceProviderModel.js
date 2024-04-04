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
      Price: {
        type: {
          type: String,
          default: 'fixed',
        },
        value: Number,
      },
    },
  ],
});

serviceProviderSchema.index({ user: 1 }, { unique: true });

const ServiceProvider = mongoose.model(
  'ServiceProvider',
  serviceProviderSchema
);
module.exports = ServiceProvider;