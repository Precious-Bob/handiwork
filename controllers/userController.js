const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) return next(new AppError('No users found', 404));

  return res.status(200).json({
    status: 'Success',
    results: users.length,
    data: users,
  });
});

exports.getSingleUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user || user.length === 0)
    return next(new AppError('No user found with that id', 404));

  return res.status(200).json({
    status: 'Success',
    data: user,
  });
});

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