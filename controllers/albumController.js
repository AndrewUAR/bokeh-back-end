const Album = require('../models/albumModel');
const factory = require('./handlerFactory.js');

exports.getAllAlbums = factory.getAll(Album);

exports.getAlbum = factory.getOne(Album);

exports.createAlbum = factory.createOne(Album);

exports.updateAlbum = factory.updateOne(Album);

exports.deleteAlbum = factory.deleteOne(Album);
