const PhotoSession = require('../models/photoSessionModel');
const factory = require('./handlerFactory');

exports.getAllPhotoSessions = factory.getAll(PhotoSession);

exports.getPhotoSession = factory.getOne(PhotoSession);

exports.createPhotoSession = factory.createOne(PhotoSession);

exports.updatePhotoSession = factory.updateOne(PhotoSession);

exports.deletePhotoSession = factory.deleteOne(PhotoSession);
