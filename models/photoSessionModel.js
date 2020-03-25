const mongoose = require('mongoose');

const photoSessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Photo session must have a name!'],
    trim: true,
    maxlength: [20, 'A tour name must have less or equal to 20 characters'],
    minlength: [5, 'A tour name must have at least 5 characters']
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Photo session must have a description!'],
    maxlength: [
      100,
      'A photo session name must have less or equal to 100 characters'
    ],
    minlength: [50, 'A photo session name must have at least 50 characters']
  },
  imageCover: {
    type: String,
    required: [true, 'A photo session must have an image cover']
  },
  photographer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photographer'
  }
});

const PhotoSession = mongoose.model('PhotoSession', photoSessionSchema);

module.exports = PhotoSession;
