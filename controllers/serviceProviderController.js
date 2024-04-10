const ServiceProvider = require('../models/serviceProviderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerfactory');

exports.createServiceProvider = catchAsync(async (req, res) => {
  const serviceProvider = await ServiceProvider.create(req.body);
  return res.status(201).json({
    status: 'Success',
    data: serviceProvider,
  });
});

exports.getAllServiceProviders = catchAsync(async (req, res, next) => {
  const serviceProviders = await ServiceProvider.find();
  if (!serviceProviders)
    return next(new AppError('No service provider found!', 404));
  return res.status(200).json({
    status: 'Success',
    results: serviceProviders.length,
    data: serviceProviders,
  });
});

exports.getServiceProvider = factory.getOne(ServiceProvider, {
  path: 'reviews',
});

exports.deleteServiceProvider = factory.deleteOne(ServiceProvider);
exports.updateServiceProvider = factory.updateOne(ServiceProvider);
