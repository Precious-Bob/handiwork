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
  location: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: {
      type: String,
      required: [true, 'Please provide your address'],
    },
  },
  type: {
    type: String,
    enum: ['user', 'serviceProvider'],
    default: 'user',
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

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.pre(/^find/, function (next) {
  // current query
  this.find({ active: { $ne: false } });
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

// In case of embedding,this  middleware is to return documents based on the id the 'guides' array submitted
// tourSchema.pre('save', async function(next){
//   const guidesPromises = this.guides(async id => await)
// })

// when using a refrence (with object id), only the ids of the object passed is returned. to return the documents, do:
// const tour = await Tour.findById(req.params.id).populate({
//   path: 'guides',
//   select: '-__v -passwordChangedAt'
// })

// but instead of doing this on more than one routes on the controller, we can do a query middleware:
//tourSchema.pre(/^find/, function(next) {
// tourSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'guides',
//     select: '-__v -passwordChangedAt'
//   }).populate({
//     path: 'user',
//     select: 'name',
// }) if it's more than one query you want to populate

//   next();
// });

// When creating a new resource e.g review :
// const newReview = await Review.create(req.body);

// if you do parent referencing and you need to access the child document from the parent, you can use a virtual populate

// Data that is a
// Starting fully tomorrow!!!
// Starting fully tomorrow!!!
