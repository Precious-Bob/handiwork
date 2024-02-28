const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name!'],
    trim: true,
    minlength: 3,
  },

  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
    trim: true,
    minlength: 3,
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
    required: true,
    minlength: 8,
  },
  address: {
    type: String,
    required: true,
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
});

//define virtual fields for password confirmation:
userSchema
  .virtual('confirmPassword')
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

userSchema.pre('validate', function (next) {
  if (this.password !== this._confirmPassword) {
    this.invalidate('confirmPassword', 'Password does not match!');
  }
  next();
});

userSchema.pre('save', async function (next) {
  try {
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

// Delete password from res.json
userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
