const Photographer = require('../models/photographerModel');
const factory = require('./handlerFactory');
const User = require('../models/userModel');

exports.getAllPhotographers = factory.getAll(User, 'photographer', {
  path: 'photographer',
  populate: { path: 'reviews' }
});

exports.getPhotographer = factory.getOne(User, {
  path: 'photographer',
  populate: { path: 'reviews' }
});

exports.createPhotographer = factory.createOne(Photographer);

exports.updatePhotographer = factory.updateOne(Photographer);

exports.deletePhotographer = factory.deleteOne(Photographer);
