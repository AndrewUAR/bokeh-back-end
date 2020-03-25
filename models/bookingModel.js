const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user!']
  },
  photographer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photographer',
    required: [true, 'Booking must belong to a photographer!']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price!']
  },
  duration: {
    type: Number,
    required: [true, 'Booking must have a duration!']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  },
  approved: {
    type: Boolean,
    default: false
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
