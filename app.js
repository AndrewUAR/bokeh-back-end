const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
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

app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

module.exports = app;
