const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = newUser.generateAuthToken();

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // If email and password is in the req body
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email });

  const token = user.generateAuthToken();
  if (!user || !(await user.comparePassword(password)))
    return next(new AppError('Incorrect email or password', 401));
  res.status(201).json({ message: `welcome, ${user.firstName}`, token: token });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  const testToken = req.headers.authorization;
  if (testToken && testToken.startsWith('Bearer'))
    token = testToken.split(' ')[1];
  console.log(req.headers);
  if (!token)
    return next(new AppError(`You're not logged in! Login to get access`, 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user with the given token does not exist!', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.isPasswordChanged(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError('We could not find the user with the given email', 404)
    );
  }
  // Generate a random reset token
  const resetToken = user.resetPswdToken();
  await user.save({ validateBeforeSave: false });
});

// exports.updatePassword = catchAsync(async (req, res, next) => {
//   // 1. get user from collection
//   const user = await User.findOne({ email });

//   // check if posted current password is correct
//   if (!user || !(await user.comparePassword(password))) {
//     return next(new AppError('Incorrect email or password', 401));
//   }

//   //if so update password
//   const salt = await bcrypt.genSalt(12);
//   const newPassword = bcrypt.hash(this.password, salt);
//   //log user in, send jwt
//   const token = user.generateAuthToken();
//   es.status(201).json({ message: `welcome, ${user.firstName}`, token: token });
// });
