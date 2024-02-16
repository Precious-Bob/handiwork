const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your last name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your first name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please proveide a valid email'],
  },
  address: { type: String },
  password: { type: String },
  // only works on save and create!
  confirmPassword: {
    validator: function (el) {
      return el === this.password;
    },
  },
});

module.exports = mongoose.model('User', userSchema);
