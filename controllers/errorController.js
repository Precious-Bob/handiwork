const AppError = require('../utils/AppError');

function castErrorHandler(err) {
  const msg = `Invalid value for ${err.path} for field ${err.value}`;
  return new AppError(msg, 400);
}

function duplicateKeyErrorHandler(err) {
  const name = err.keyValue.email;
  const msg = `A user with the email '${name}' already exist. Please use another email!`;
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

    prodErrors(err, res);
  }
};
