const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Reviews = require('../models/reviews.model');
const Orders = require('../models/orders.model');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

//* protection of token / token de proteccion
exports.protects = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('identify yourself to log in', 401));
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await Users.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError('token owner is no longer active', 401));
  }

  req.sessionUser = user;
  next();
});

//* protecct owner account, oders and reviews / proteccion de usuarios y ordenes

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('you do not own this account.', 401));
  }

  next();
});

exports.protectAccountOwnerByOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Orders.findOne({
    where: { id },
  });

  if (order.userId !== sessionUser.id) {
    return next(new AppError('You do not own this account.', 401));
  }

  next();
});

exports.protectAccountOwnerByReview = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const review = await Reviews.findOne({
    where: { id },
  });

  if (review.userId !== sessionUser.id) {
    return next(new AppError('You do not own this account.', 401));
  }

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('You do not have access to perform this action!', 403)
      );
    }

    next();
  };
};
