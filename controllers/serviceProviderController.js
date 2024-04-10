const ServiceProvider = require('../models/serviceProviderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerfactory');

exports.createServiceProvider = factory.createOne(ServiceProvider);

exports.getAllServiceProviders = factory.getAll(ServiceProvider);

// exports.getMe = (req, res, next) => {
//   console.log(req.serviceProvider.id, req.params.id);
//   req.params.id = req.serviceProvider.id;
//   next();
// };
exports.getServiceProvider = factory.getOne(ServiceProvider, {
  path: 'reviews',
});

exports.deleteServiceProvider = factory.deleteOne(ServiceProvider);
exports.updateServiceProvider = factory.updateOne(ServiceProvider);
