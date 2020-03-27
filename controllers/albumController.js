const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const Album = require('../models/albumModel');
const factory = require('./handlerFactory.js');
const catchAsync = require('../utils/catchAsync');

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

exports.uploadAlbumImages = upload.fields([{ name: 'images', maxCount: 10 }]);

exports.resizeAlbumImages = catchAsync(async (req, res, next) => {
  // if (!req.files.images) return next();
  // console.log(req.files.images[0].originalname);
  // const file = dataUri(req).content;
  // req.body.images = await cloudinary.v2.uploader.upload(file, {
  //   public_id: `users/user-${req.user.id}-${Date.now()}`,
  //   gravity: 'face',
  //   width: 500,
  //   height: 500,
  //   crop: 'thumb'
  // });
  // next();
  // const files = req.files.images.map(img => dataUri(img).content);
  // console.log(files);
});

exports.getAllAlbums = factory.getAll(Album);

exports.getAlbum = factory.getOne(Album);

exports.createAlbum = factory.createOne(Album);

exports.updateAlbum = factory.updateOne(Album);

exports.deleteAlbum = factory.deleteOne(Album);
