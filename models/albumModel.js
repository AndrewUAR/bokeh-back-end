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
  }
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
