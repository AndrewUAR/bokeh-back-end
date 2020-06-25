const Joi = require('@hapi/joi');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');

exports.getAllPhotographers = factory.getAll(User, {role: 'photographer'});

exports.getPhotographer = catchAsync(async (req, res, next) => {
  const query = User.findById(req.params.id);
  const document = await query.populate('reviews photoSessions albums');
  if (!document || document.role === 'user' || document.role === 'admin') {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: document
  });
});

const allowedFields = ['introduction', 'languages', 'location', 'categories'];

exports.createPhotographerProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  if (user.hideProfile === true) {
    return next(
      new AppError(
        'This user already has a photographer profile. Please reactivate it!'
      )
    );
  }

  const schema = Joi.object().keys({
    introduction: Joi.string().required(),
    categories: Joi.array().required(),
    languages: Joi.array().required(),
    location: Joi.object().required(),
    payPal: Joi.string().required()
  });

  const userData = await schema.validateAsync(req.body);

  const filteredBody = { photographer: userData };
  filteredBody.role = 'photographer';

  const photographer = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(201).json({
    status: 'success',
    data: photographer
  });
});

exports.updatePhotographerProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  const filteredBody = { photographer: filterObj(req.body, allowedFields) };

  const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(201).json({
    status: 'success',
    data: updatedUser
  });
});

exports.activateProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  if (user.hideProfile === false && user.role === 'photographer') {
    return next(
      new AppError('This photographer account is already activated.')
    );
  }
  const body = { role: 'photographer', hideProfile: false };
  const updatedUser = await User.findByIdAndUpdate(req.params.id, body);
  res.status(201).json({
    status: 'success',
    data: updatedUser
  });
});

exports.deactivateProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  if (user.hideProfile === true && user.role === 'user') {
    return next(
      new AppError('This photographer account is already deactivated.')
    );
  }
  const body = { role: 'user', hideProfile: true };
  const updatedUser = await User.findByIdAndUpdate(req.params.id, body, {
    runValidators: true
  });

  res.status(201).json({
    status: 'success',
    data: updatedUser
  });
});
