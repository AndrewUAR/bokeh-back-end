const mongoose = require('mongoose');
const User = require('./userModel');
const PhotoSession = require('./photoSessionModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review can not be blank!'],
      trim: true,
      maxLength: [250, 'A review can not be longer than 250 characters!'],
      minLength: [30, 'A review can not be shorter than 30 characters!']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    photographer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to photographer!']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user!']
    },
    photoSession: {
      type: mongoose.Schema.ObjectId,
      ref: 'PhotoSession',
      required: [true, 'Review must belong to photo session!']
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
