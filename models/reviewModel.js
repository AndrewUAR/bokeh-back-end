const mongoose = require('mongoose');
const User = require('./userModel');

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
      ref: 'Photographer',
      required: [false, 'Review must belong to photographer!']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user!']
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

reviewSchema.statics.calcAverageRatings = async function(photographerId) {
  const stats = await this.aggregate([
    {
      $match: { photographer: photographerId }
    },
    {
      $group: {
        _id: '$photographer',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await User.findByIdAndUpdate(photographerId, {
      photographer: {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
      }
    });
  } else {
    await User.findByIdAndUpdate(photographerId, {
      photographer: {
        ratingsQuantity: 0,
        ratingsAverage: 0
      }
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.photographer);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
});

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.photographer);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
