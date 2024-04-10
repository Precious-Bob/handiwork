const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerfactory');

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};


exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  // you don't check if there's user because the user should be logged in and authorized already (protect route)
  console.log(user);
  if (!(await user.comparePassword(req.body.password, user.password))) {
    return next(
      new AppError('The current password you provided is wrong!', 401)
    );
  }
  // If password is correct, update password
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  console.log(req.body);
  await user.save();

  // login user & send Jwt
  const signToken = user.generateAuthToken();
  res.status(201).json({
    message: `Password changed successfully`,
    token: signToken,
    data: { user },
  });
});

function filterReqObj(obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) newObj[prop] = obj[prop];
  });
  return newObj;
}

exports.updateMe = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  // If req data contain pasword | confirmPassword
  if (password || confirmPassword) {
    return next(
      new AppError(
        `You can't update your password using this endpoint, use /updateMyPassword`
      )
    );
  }
  // Filtering out unwanted field names that aren't allowed to be updated
  const filterObj = filterReqObj(req.body, 'name', 'email');
  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
