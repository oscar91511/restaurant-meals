const AppError = require('../utils/appError');
const Local = require('../models/local.model');
const catchAsync = require('../utils/catchAsync');
const Meals = require('../models/meals.model');

exports.validMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meals.findOne({
    where: {
      id,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'restaurantId', 'status'],
    },
    include: [
      {
        model: Local,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'status'],
        },
      },
    ],
  });

  if (!meal) {
    return next(new AppError(`The meal with id:${id} it's not found `, 404));
  }

  req.meal = meal;
  next();
});
