const axios = require('axios');
const utf8 = require('utf8');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const _ = require('lodash');

exports.getData = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const place = utf8.encode(req.body.place);
  console.log(place)
  let results;
  if (place) {
    results = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&cachebuster=1588883251539&autocomplete=true&types=place&limit=5&language=en`);
    console.log(results.data.features)
    const pickAddress = (item) => {
      return _.pick(item, ['place_name', 'center'])
    }
    const response = _.map(results.data.features, pickAddress);
    res.status('200').json({
      status: 'success',
      data: response
    });
  }
})