const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getUsers = catchAsync(async (_, _, next) => {
  const users = User.find();
  if (!users || users.length === 0)
    return next(new AppError('No users found', 404));

  return res.status(200).json
});

exports.getSingleUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user || user.length === 0)
    return next(new AppError('No user found', 404));

  return res.status(200).json({
    data: user,
  });
});
