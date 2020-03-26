const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Photographer = require('../models/photographerModel');

exports.getAll = (Model, userRole, popOptions) =>
  catchAsync(async (req, res, next) => {
    const role = { role: userRole };
    const document = await Model.find(role).populate(popOptions);

    res.status(200).json({
      status: 'success',
      results: document.length,
      data: document
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const document = await query;

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: document
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    let document = await Model.create(req.body);
    if (Model === Photographer) {
      req.params.id = req.body.user;
      req.body = { role: 'photographer' };
      document = await User.findByIdAndUpdate(req.params.id, req.body).populate(
        'photographer'
      );
    }
    res.status(201).json({
      status: 'success',
      data: {
        document
      }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(201).json({
      status: 'success',
      data: document
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: null
    });
  });
