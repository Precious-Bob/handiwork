const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.signup = catchAsync(async (req, res, next) => {
  // const { firstName, lastName, email, address, password, confirmPassword } =
  //   req.body;
  // if (password !== confirmPassword)
  //   return res.status(400).json({ message: 'Passwords do not match' });

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
  es.status(201).json({ message: `welcome, ${user.firstName}`, token: token });
});

// test this with email and password field
// take if password deletes when user is created

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  if (!token) return next(new AppError(`You're not logged in!`, 401));
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. get user from collection
  const user = await User.findOne({ email });

  // check if posted current password is correct
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //if so update password
  const salt = await bcrypt.genSalt(12);
  const newPassword = bcrypt.hash(this.password, salt);
  //log user in, send jwt
  const token = user.generateAuthToken();
  es.status(201).json({ message: `welcome, ${user.firstName}`, token: token });
});
