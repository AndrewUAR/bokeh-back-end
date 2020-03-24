const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    languages: [String],
    locations: [[Number]]
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

photographerSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'photographer'
});

const Photographer = mongoose.model('Photographer', photographerSchema);

module.exports = Photographer;
