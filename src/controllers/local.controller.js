const AppError = require('../utils/appError');
const Local = require('../models/local.model');
const catchAsync = require('../utils/catchAsync');
const Reviews = require('../models/Reviews');

exports.findLocal = catchAsync(async (req, res, next) => {
  const locals = await Local.findAll({
    where: {
      status: 'active',
    },
    include: [
      {
        model: Reviews,
        where: { status: 'active' },
        attributes: { exclude: ['createdAt', 'updatedAt', 'restaurantId'] },
        required: false,
      },
    ],
    attributes: { exclude: ['createdAt', 'updateAt', 'status'] },
  });

  res.status(200).json({
    status: 'success',
    results: Local.length,
    locals,
  });
});

exports.createNewLocal = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const LocalRestaurant = await Local.findOne({
    where: {
      address: address.toLowerCase(),
    },
  });

  if (LocalRestaurant) {
    return next(new AppError('This restaurant addres are actualy in use', 409));
  }

  const RestaurantLocal = await Local.create({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
    rating,
  });

  res.status(201).json({
    status: 'success',
    message: 'The LocalRestauran was created',
    RestaurantLocal: {
      id: RestaurantLocal.id,
      name: RestaurantLocal.name,
      address: RestaurantLocal.address,
      rating: RestaurantLocal.rating,
    },
  });
});

exports.updateReviews = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { reviews } = req;

  const updatedReviews = await reviews.update({ comment, rating });
  res.status(200).json({
    status: 'success',
    message: 'The review has been updated',
    updatedReviews,
  });
});

exports.createsNewsReviews = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { sessionUser } = req;
  const { comment, rating } = req.body;

  const review = await Reviews.create({
    comment,
    rating,
    restaurantId: restaurant.id,
    userId: sessionUser.id,
  });

  res.status(200).json({
    status: 'success',
    message: 'are created a new review success',
    review: {
      comment: review.comment,
      rating: review.rating,
      restaurant: restaurant.name,
    },
  });
});

exports.deleteReviews = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: 'deleted' });
  res.status(200).json({
    status: 'success',
    message: 'The review has been deleted.',
  });
});

exports.findLocalRestaurantById = catchAsync(async (req, res, next) => {
  const { LocalRestaurant } = req;

  res.status(200).json({
    status: 'success',
    LocalRestaurant,
  });
});

exports.updateLocalRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  const updatedRestaurant = await restaurant.update({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
  });

  res.status(200).json({
    status: 'success',
    message: 'The Localrestaurant has been updated.',
    updatedRestaurant,
  });
});

exports.deleteLocalRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: 'disabled' });

  res.status(200).json({
    status: 'success',
    message: 'The restaurant has been deleted.',
  });
});
