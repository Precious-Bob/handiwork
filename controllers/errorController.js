const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

function castErrorHandler(err) {
  const msg = `Invalid value for ${err.path} for field ${err.value}`;
  return new AppError(msg, 400);
}

function duplicateKeyErrorHandler(err) {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
}
// Mongoose validation error handler
function validationErrHandler(err) {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMsgs = errors.join('. ');
  const msg = `Invalid input data: ${errorMsgs}`;
  return new AppError(msg, 400);
}

function JwtErrorHandler(err) {
  const msg = `${err.message}: We couldn't find your authentication information. Please check if you're logged in and try again`;
  return new AppError(msg, 400);
}

function devErrors(error, res) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error,
  });
}

function prodErrors(err, res) {
  if (err.isOperational) { 
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went wrong!',
    });
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    devErrors(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = castErrorHandler(err);
    if (err.code === 11000) err = duplicateKeyErrorHandler(err);
    if (err.name === 'ValidationError') err = validationErrHandler(err);
    if (err instanceof jwt.JsonWebTokenError) err = JwtErrorHandler(err);

    prodErrors(err, res);
  }
};
