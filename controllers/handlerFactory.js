const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.find();

    res.status(200).json({
      status: 'success',
      results: document.length,
      data: document
    });
  });

exports.getOne = (Model, popOptions) => 
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    // if (popOptions) query = query.populate(popOptions);
    const document = await query;

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'succes',
      data: document
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);
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
