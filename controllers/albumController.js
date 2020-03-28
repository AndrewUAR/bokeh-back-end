const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const Album = require('../models/albumModel');
const factory = require('./handlerFactory.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();
const datauri = new Datauri();

const dataUri = img =>
  datauri.format(path.extname(img.originalname).toString(), img.buffer);

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
  if (!req.files) return next();
  const files = req.files.images.map(img => {
    return dataUri(img).content;
  });
  const uploadedFiles = await Promise.all(
    files.map(file => {
      return cloudinary.v2.uploader.upload(file, {
        public_id: `bokeh/users-album/user-${req.user.id}/${
          req.user.id
        }-${Date.now()}}`
      });
    })
  );
  req.body.images = uploadedFiles.map(file => {
    return file.secure_url;
  });
  next();
  // next();
  // const files = req.files.images.map(img => dataUri(img).content);
  // console.log(files);
});

exports.updateAlbumImage = catchAsync(async (req, res, next) => {
  const album = await Album.findByIdAndUpdate(
    req.params.id,
    {
      $push: { images: req.body.images }
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).json({
    status: 'success',
    data: album
  });
  next();
});

exports.deleteAlbumImage = catchAsync(async (req, res, next) => {
  if (!req.body.images) next();
  const images = req.body.images.map(img => {
    return img.match(/([a-zA-Z0-9]+-[0-9]{9,})/g);
  });

  await Promise.all(
    images.map(image => {
      return cloudinary.v2.uploader.destroy(image, result => {
        console.log(result);
      });
    })
  );

  const album = await Album.findByIdAndUpdate(
    req.params.id,
    { $pullAll: { images: req.body.images } },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    data: album
  });
  next();
});

exports.getAllAlbums = factory.getAll(Album);

exports.getAlbum = factory.getOne(Album);

exports.createAlbum = factory.createOne(Album);

exports.updateAlbum = factory.updateOne(Album);

exports.deleteAlbum = factory.deleteOne(Album);
