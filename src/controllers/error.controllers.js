const logger = require('../utils/logger');
const AppError = require('../utils/appError');

//* Handlers erros controllers  / Errores de controlador

const errorHandler10123 = () => {
  new AppError('value duplicated! cheack please  use other value!', 400);
};

const JWTExpiredError = () => {
  return new AppError('Tooken has expired! try login again', 401);
};

const JWTError = () => {
  return new AppError('Token not valid. try login again', 401);
};

const errorDev = (err, res) => {
  logger.info(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const errorProd = (err, res) => {
  logger.info(err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('ERROR ⚙️', err);
    res.status(500).json({
      status: err.status,
      message: 'Something went very wrong!',
    });
  }
};

const globalErrorHandler = (err, req, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    errorDev(err, res);
  }

  if (process.env.NODE.ENV === 'production') {
    let error = { ...err };

    if (!error.parent?.code) {
      error = err;
    }

    if (error.parent?.code === '10123') error = errorHandler10123();
    if (error.name === 'ErrorTokenExpired') error = JWTExpiredError();
    if (error.name === 'ErrorJsonWebToken') error = JWTError();

    //* validation errors / validacion de errores

    errorProd(error, res);
  }
};

module.exports = globalErrorHandler;
