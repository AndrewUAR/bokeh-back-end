const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const PhotoSession = require('../models/photoSessionModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();
const datauri = new Datauri();

const dataUri = req =>
  datauri.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer
  );

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadCoverImage = upload.single('imageCover');

exports.resizeCoverImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const file = dataUri(req).content;
  req.body.imageCover = await cloudinary.v2.uploader.upload(file, {
    public_id: `bokeh/users/user-${req.user.id}/photoSessionCovers/${
      req.user.id
    }-${Date.now()}`
  });
  next();
});

exports.getAllPhotoSessions = factory.getAll(PhotoSession);

exports.getPhotoSession = factory.getOne(PhotoSession);

exports.createPhotoSession = factory.createOne(PhotoSession);

exports.updatePhotoSession = factory.updateOne(PhotoSession);

exports.deletePhotoSession = factory.deleteOne(PhotoSession);
