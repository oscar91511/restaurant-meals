const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const sanitizer = require('perfect-express-sanitizer');

//* manegement errors / manejo de errores

const globalErrorHandler = require('./controllers/error.controllers');
const AppError = require('./utils/appError');

//* manegement rutes / manejo de rutas

const userRouter = require('./routes/users.routes');
const ordersRouter = require('./routes/orders.routes');
const localRouter = require('./routes/local.routes');
const mealsRouter = require('./routes/meals.routes');

const app = express();
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'request IP are blocked, please try again on one hours',
});

//* conntrollers middleware / controladores middleware

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(cors());
app.use(
  hpp(
    sanitizer.clean({
      xss: true,
      noSql: true,
      sql: false,
    })
  )
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//* Routes / Rutas

app.use('/api/v1/', limiter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/odersRoutes', ordersRouter);
app.use('/api/v1/local', localRouter);
app.use('/api/v1/meals', mealsRouter);

//* Manegement Errors / Manejo de erorres

app.all('*', (req, res, next) => {
  return next(new AppError(`Not found ${req.originalUrl} on this server, 404`));
});

app.use(globalErrorHandler);

module.exports = app;
