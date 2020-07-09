const Joi = require('@hapi/joi');
const _ = require('lodash');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllPhotographers = factory.getAll(User, {
  role: 'photographer'
});

exports.getAllPhotographersWithin = catchAsync(async (req, res, next) => {
  // const {
  //   distance,
  //   latlng,
  //   unit
  // } = req.params;
  // let [lng, lat] = latlng.split(',');

  // const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  // if (!lat || !lng) {
  //   next(
  //     new AppError(
  //       'Please provide latitude and longitude in the format lat, lng.',
  //       400
  //     )
  //   );
  // }

  // const results = new APIFeatures(User.find({
  //     'photographer.location': {
  //       $geoWithin: {
  //         $centerSphere: [
  //           [lng, lat], radius
  //         ]
  //       }
  //     }
  //   }), req.query).filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();

  console.log('body', req.body);

  const {
    distanceRange,
    coordinates,
    sort,
    page,
    resultsPerPage,
    categories,
    languages,
    priceRange,
    rating
  } = req.body;

  const lng = coordinates[0];
  const lat = coordinates[1];

  const query = {};

  if (rating) {
    query["photographer.ratingsAverage"] = {
      $gte: rating
    };
  };

  if (!_.isEmpty(categories)) {
    query["photographer.categories"] = {
      $in: categories
    };
  };

  if (!_.isEmpty(languages)) {
    query["photographer.languages"] = {
      $in: languages
    };
  };

  const photographers = await User.aggregate([{
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [lng, lat]
      },
      distanceField: "dist.fromMe",
      maxDistance: parseInt(distanceRange) * 1609.34,
      query: query,
      spherical: true
    }
  }, {
    $sort: {
      "photographer.ratingsAverage": 1
    }
  }, {
    $group: {
      _id: null,
      count: {
        $sum: 1
      },
      document: {
        $push: "$$ROOT"
      }
    }
  }, {
    $unwind: "$document"
  }, {
    $skip: resultsPerPage * (page - 1)
  }, {
    $limit: resultsPerPage
  }, {
    $group: {
      _id: null,
      results: {
        $first: "$count"
      },
      photographers: {
        $push: "$document"
      }
    }
  }]);

  res.status(200).json({
    status: 'success',
    results: photographers.length,
    data: photographers
  });
})



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

  const filteredBody = {
    photographer: userData
  };
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

  // const schema = Joi.object().keys({
  //   introduction: Joi.string(),
  //   categories: Joi.array(),
  //   languages: Joi.array(),
  //   location: Joi.object(),
  //   payPal: Joi.string()
  // });

  // const userData = await schema.validateAsync(req.body);

  const filteredBody = {
    photographer: filterObj(req.body, allowedFields)
  };

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
  const body = {
    role: 'photographer',
    hideProfile: false
  };
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
  const body = {
    role: 'user',
    hideProfile: true
  };
  const updatedUser = await User.findByIdAndUpdate(req.params.id, body, {
    runValidators: true
  });

  res.status(201).json({
    status: 'success',
    data: updatedUser
  });
});