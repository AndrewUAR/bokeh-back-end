/* eslint-disable no-console */
const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  let message;
  if ('email' in err.keyValue){
    message = `User with email ${Object.values(
      err.keyValue
    )} already exists.`;
  } else {
    message = `Duplicate field value: ${Object.values(
      err.keyValue
    )}. Please use another value!`;
  }
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = err =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = err =>
  new AppError('Your token has expired! Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    console.log('ERROR', err);
    return res.status(500).json({
      status: 'error',
      message: `Something went very wrong!`
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    });
  }
  console.log('ERROR', err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  console.log(err)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    sendErrorProd(error, req, res);
  }
};
