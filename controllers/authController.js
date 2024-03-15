const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
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

  const user = await User.findOne({ email }).select('+password');

  // If user exists and password matches
  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));
  // Login user
  const token = user.generateAuthToken();
  res.status(201).json({ message: `welcome, ${user.firstName}`, token });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  const testToken = req.headers.authorization;
  if (testToken && testToken.startsWith('Bearer'))
    token = testToken.split(' ')[1];
  if (!token)
    return next(new AppError(`You're not logged in! Login to get access`, 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded._id);
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
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('We could not find the user with the given email', 404)
    );
  }
  // Generate a random reset token
  const resetToken = user.resetPswdToken();
  await user.save({ validateBeforeSave: false });
  // Send the token to the user email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Please use the link below to reset your password\n\n${resetURL}\n\n This link will expire in 10 minutes`;
  try {
    if (!message) {
      return next(new AppError('Missing email message content', 404));
    }

    await sendEmail({
      email: user.email,
      subject: 'Password change request received',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    return next(
      new AppError('There was an error sending the email, try again later', 404)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // If the user exists with the given token & token hasn't expired
  const token = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired!', 404));
  }

  // set new password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  user.save();

  // Login user
  const signToken = user.generateAuthToken();
  res.status(201).json({ message: `Success`, token: signToken });
});
