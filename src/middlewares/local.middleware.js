const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Local = require('../models/local.model');
const Meals = require('../models/meals.model');
const Reviews = require('../models/Reviews');


exports.validationRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Local.findOne({
    where: {
      id,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Reviews,
        where: { status: 'active' },
        attributes: { exclude: ['createdAt', 'updatedAt', 'restaurantId'] },
        required: false,
      },
      {
        model: Meals,
      },
    ],
  });

  if (!restaurant) {
    return next(new AppError(`The Local Restaurant with id:${id} has not found`, 404));
  }

  req.meals = restaurant.meals;
  req.restaurant = restaurant;
  next();
});

exports.validationReview = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;

  const review = await Reviews.findOne({
    where: {
      id,
      restaurantId,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  });

  if (!review) {
    return next(new AppError(`review has not found`, 404));
  }

  req.review = review;
  next();
});
