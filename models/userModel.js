const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name!'],
    trim: true,
    minlength: 3,
    maxLength: 30,
  },

  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
    trim: true,
    minlength: 3,
    maxLength: 30,
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // note: This only works on CREATE and SAVE
      validator: function (el) {
        console.log(el);
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },

  address: {
    type: String,
    required: [true, 'Please provide an address'],
    trim: true,
  },
  // Timestamps for user creation and updates
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,

  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirm password field
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePassword = async function (password, passwordDB) {
  return bcrypt.compare(password, passwordDB);
};

//  take note of this in adding admin if needed { _id: user._id, admin: user.admin },
userSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

// Delete password from res.json
userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.confirmPassword;
  return userObj;
};

userSchema.methods.isPasswordChanged = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.resetPswdToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
