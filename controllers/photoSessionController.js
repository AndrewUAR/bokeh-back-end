const PhotoSession = require('../models/photoSessionModel');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.getAll(PhotoSession);

exports.getUser = factory.getOne(PhotoSession);

exports.createUser = factory.createOne(PhotoSession);

exports.updateUser = factory.updateOne(PhotoSession);

exports.deleteUser = factory.deleteOne(PhotoSession);
