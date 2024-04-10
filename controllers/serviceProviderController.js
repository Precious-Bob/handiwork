const ServiceProvider = require('../models/serviceProviderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerfactory');

exports.createServiceProvider = factory.createOne(ServiceProvider);

exports.getAllServiceProviders = factory.getAll(ServiceProvider);

exports.getServiceProvider = factory.getOne(ServiceProvider, {
  path: 'reviews',
});

exports.deleteServiceProvider = factory.deleteOne(ServiceProvider);
exports.updateServiceProvider = factory.updateOne(ServiceProvider);
