const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const photoSessionRouter = require('./routes/photoSessionRoutes');
const photographerRouter = require('./routes/photographerRoutes');
const albumRouter = require('./routes/albumRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const thirdPartyAPIRoutes = require('./routes/thirdPartyAPIRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// app.use(cors());

// app.use(
//   cors({
//     origin: 'https://localhost:3000',
//     credentials: true
//   })
// );

app.use(
  cors({
    credentials: true,
    origin: [
      'https://mypanorama.netlify.app',
      'https://d1hhdxamuic6it.cloudfront.net',
      'http://localhost:3000'
    ]
  })
);

app.use(cookieParser());
app.use(helmet());
app.use(xss());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (process.env.NODE_ENV !== 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 500,
  windows: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});

app.use('/api', limiter);

app.use(compression());
app.use(mongoSanitize());

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
app.use('/api/v1/data', thirdPartyAPIRoutes);

app.use(globalErrorHandler);

module.exports = app;
