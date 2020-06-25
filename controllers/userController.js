const multer = require('multer');
const path = require('path');
const Joi = require('@hapi/joi');
const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');

const multerStorage = multer.memoryStorage();
const datauri = new Datauri();

const dataUri = req =>
  datauri.format(
    '.jpg',
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

exports.uploadUserPhoto = upload.single('profilePhoto');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  console.log(req.file)
  const file = dataUri(req).content;
  req.file = await cloudinary.v2.uploader.upload(file, {
    public_id: `bokeh/users/user-${req.user.id}-${Date.now()}`,
    gravity: 'face',
    width: 500,
    height: 500,
    crop: 'thumb'
  });
  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  const schema = Joi.object().keys({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().optional()
  });

  const userData = await schema.validateAsync(req.body);

  if (req.file) {
    userData.profilePhoto = req.file.secure_url
    console.log('here2')
  };
  const updatedUser = await User.findByIdAndUpdate(req.user.id, userData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getMe = (req, res, next) => {
  console.log('in get me')
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.createUser = factory.createOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
