const Photographer = require('../models/photographerModel');
const factory = require('./handlerFactory');
const User = require('../models/userModel');

exports.getAllPhotographers = factory.getAll(User, 'photographer', {
  path: 'photographer',
  select: '-__v',
  populate: { path: 'reviews albums photoSessions', select: '-__v' }
});

exports.getPhotographer = factory.getOne(User, {
  path: 'photographer',
  populate: { path: 'reviews albums photoSessions' }
});

exports.setUserId = (req, res, next) => {
  req.params.user = req.user.id;
};

exports.createPhotographer = factory.createOne(Photographer);

exports.updatePhotographer = factory.updateOne(Photographer);

exports.deletePhotographer = factory.deleteOne(Photographer);
