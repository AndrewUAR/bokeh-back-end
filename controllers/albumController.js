const multer = require('multer');
const path = require('path');
const _ = require('lodash');
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
  console.log('files', req.files)
  const files = req.files.images.map(img => {
    return dataUri(img).content;
  });
  const uploadedFiles = await Promise.all(
    files.map(file => {
      return cloudinary.v2.uploader.upload(file, {
        public_id: `panorama/users-album/user-${req.user.id}/${
          req.user.id
        }-${Date.now()}`
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
  if (!req.body.images || _.isEmpty(req.body.images)) {
    next();
  }
  const images = req.body.images.map(img => {
    return img.match(/(panorama.*)\./)[1];
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

exports.getAllAlbums = factory.getAll(Album, 'photographer');

exports.getAllMyAlbums = catchAsync(async (req, res, next) => {
  const albums = await Album.find({'photographer': req.user.id});
  res.status(200).json({
    status: 'success',
    data: {
      albums
    }
  });
})

exports.getAlbum = factory.getOne(Album);

exports.setPhotographerId = (req, res, next) => {
  req.body.photographer = req.user.id;
  next();
};

exports.deleteAlbum = catchAsync(async (req, res, next) => {
  let album = await Album.findByIdAndDelete(req.params.id);
  const images = album.images;
  
  if (!_.isEmpty(images)) {
    const imagesPublicIds = images.map(img => {
      return img.match(/(panorama.*)\./)[1];
    });

    await Promise.all(
      imagesPublicIds.map(publicId => {
        return cloudinary.v2.uploader.destroy(publicId, result => {
        });
      })
    );
  }
  
  if (!album) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: null
  });

})

exports.createAlbum = factory.createOne(Album);

exports.updateAlbum = factory.updateOne(Album);

// exports.deleteAlbum = factory.deleteOne(Album);
