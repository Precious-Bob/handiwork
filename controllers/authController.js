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
  if (!email || !password) {
    const err = new AppError('Please provide email and password');
    return next(err);

    // If user exists with the given email
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password matches
    if (!user || )
    const token = user.generateAuthToken();
  }
  res.status
});

// test this with email and password field
// take if password deletes when user is created
