const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      unique: true
    },
    bio: {
      type: String,
      required: [false, 'A bio can not be blank!'],
      trim: true,
      maxLength: [250, 'A bio can not be longer than 250 characters!'],
      minLength: [100, 'A bio can not be shorter than 100 characters!']
    },
    languages: [String],
    locations: {
      type: [[Number]],
      required: [false, 'Photographer must have a location!']
    },
    specialties: {
      type: [String],
      required: [false, 'A bio can not be blank!']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    ratingsAverage: {
      type: Number,
      default: 5,
      min: [1, 'Rating must be above 0.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    hired: {
      type: Number,
      default: 0
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

photographerSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'photographer'
});

photographerSchema.virtual('photoSessions', {
  ref: 'PhotoSession',
  localField: '_id',
  foreignField: 'photographer'
});

photographerSchema.virtual('albums', {
  ref: 'Album',
  localField: '_id',
  foreignField: 'photographer'
});

const Photographer = mongoose.model('Photographer', photographerSchema);

module.exports = Photographer;
