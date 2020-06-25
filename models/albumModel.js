const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Album must have a name!']
  },
  photographer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  images: [String],
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
