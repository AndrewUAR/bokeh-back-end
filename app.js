const express = require('express');
const morgan = require('morgan');
const cloudinary = require('cloudinary');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const photoSessionRouter = require('./routes/photoSessionRoutes');
const photographerRouter = require('./routes/photographerRoutes');
const albumRouter = require('./routes/albumRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV !== 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});

app.use('/api', limiter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/photographers', photographerRouter);
app.use('/api/v1/photoSessions', photoSessionRouter);
app.use('/api/v1/albums', albumRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use(globalErrorHandler);

module.exports = app;
