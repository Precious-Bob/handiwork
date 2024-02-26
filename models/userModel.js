const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Define Joi schema
const userJoiSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required().messages({
    'any.required': 'Please provide your first name',
  }),
  lastName: Joi.string().required().min(3).max(30).messages({
    'any.required': 'Please provide your last name',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Please provide your email',
  }),
  address: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
  }),
});

// Define Mongoose schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  address: String,
  password: String,
  confirmPassword: String,
});

userSchema.pre('save', async function (next) {
  try {
    // Make a copy of the user data
    const userData = { ...this.toObject() };

    // Delete the _id field
    delete userData._id;

    // Validate the user data without _id field
    await userJoiSchema.validateAsync(userData);

    // Check if the password is modified and hash it if necessary
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(12);
      this.password = bcrypt.hash(this.password, salt);
    }

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Pass any validation errors to the next middleware
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

//  take note of this in adding admin if needed { _id: user._id, admin: user.admin },
userSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

//delete password and confirmPassword from res.json
userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.confirmPassword;
  delete userObj.password;
  return userObj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
