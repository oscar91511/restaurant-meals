const AppError = require('../utils/appError');
const Local = require('../models/local.model');
const catchAsync = require('../utils/catchAsync');
const Meals = require('../models/meals.model');

//* find the meal / peticion para encontrar la comida

exports.findMeals = catchAsync(async (req, res, next) => {
  const meals = await Meals.findAll({
    where: {
      status: 'active',
    },
    atributes: {
      exclude: ['createdAt', 'updatedAt', 'status', 'restaurantId'],
    },
    includes: [
      {
        model: Local,
        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
      },
    ],
  });
  res.status(201).json({
    status: 'success',
    results: meals.length,
    meals,
  });
});

//* update new meal / actualizacion de la peticion de comida

exports.updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  const updatedMeal = await meal.update({ name, price });

  res.status(201).json({
    status: 'success',
    message: 'meal has been updated.',
    updatedMeal,
  });
});

//* create new meal / creacion de un nueva comida

exports.createNewMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { id } = req.params;
  const { restaurant } = req;

  const mealInDB = await Meals.findOne({
    where: {
      name,
    },
  });

  if (mealInDB) {
    return next(new AppError('The meal name are already in use!', 409));
  }

  const meal = await Meals.create({
    name,
    price,
    restaurantId: id,
  });

  res.status(201).json({
    status: 'success',
    message: 'meal has been created.',
    meal: {
      id: meal.id,
      name: meal.name,
      price: meal.price,
      restaurant: restaurant.name,
    },
  });
});

//* delted the meal /  peticion para eliminar comida

exports.deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: 'disabled' });

  res.status(201).json({
    status: 'success',
    message: 'meal has been deleted.',
  });
});

//* find meal by id / peticion para encontrar comida por id

exports.findMealById = catchAsync(async (req, res, next) => {
  const { meal } = req;

  res.status(201).json({
    status: 'success',
    meal,
  });
});
