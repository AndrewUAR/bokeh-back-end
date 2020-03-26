const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Album must have a name!']
  },
  photographer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photographer'
  },
  images: {
    type: [String],
    required: [true, 'Album can not be empty']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  lastUpdated: {
    type: Date,
    default: Date.now()
  }
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
