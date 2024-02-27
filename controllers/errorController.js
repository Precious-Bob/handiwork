const AppError = require('../utils/AppError');

function castErrorHandler() {
  const msg = `Invalid value for ${err.path} for field ${err.value}`;
  return new AppError(msg, 400);
}

function devErrors(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err: err,
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
    if (err.name === 'CastError') {
      err = castErrorHandler(err);
    }
    prodErrors(err, res);
  }
};

// check joi error msg
// check invalid id error msg
