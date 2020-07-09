const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const _ = require('lodash');

exports.getPlaces = catchAsync(async (req, res, next) => {
  const place = req.body.place;
  let results;
  if (place) {
    results = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&cachebuster=1588883251539&autocomplete=true&types=place&limit=5&language=en`);
    const pickAddress = (item) => {
      const { place_name: placeName, center: coordinates} = _.pick(item, ['place_name', 'center']);
      return { placeName, coordinates }
    }
    const response = _.map(results.data.features, pickAddress);
    console.log(results.data);
    res.status('200').json({
      status: 'success',
      data: response
    });
  };
});

exports.getMyPlace = catchAsync(async (req, res, next) => {
  const coordinates = req.body;
  console.log('controller', coordinates);
  let result;
  if (coordinates.length > 0) {
    const lng  = coordinates[0];
    const lat = coordinates[1];
    result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&types=place`);
  }
  console.log(result.data.features[0]);
  const response = result.data.features[0].place_name;
  res.status('200').json({
    status: 'success',
    data: response
  });
})