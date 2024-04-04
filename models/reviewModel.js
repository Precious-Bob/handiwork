const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
