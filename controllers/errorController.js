const AppError = require('../utils/appError');

const handleCastErrorDb = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const message = `Duplicate field value: ${Object.values(
    err.keyValue
  )}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

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
