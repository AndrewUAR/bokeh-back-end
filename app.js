const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary');
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

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
// var corsOptions = {
//   origin: 'http://localhost:3000'
// }

// app.options('*', cors());

app.use(cookieParser());
app.use(helmet());
app.use(xss());

// app.use((req, res) => {
//   console.log('here');
//   const store = createStore(reducer, undefined, autoRehydrate());
//   console.log(store)
//   persistStore(store, { storage: new CookieStorage({ cookies: req.cookies }) })
// })

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
