const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Users = require('../models/users.model');
const Meals = require('../models/meals.model');
const Local = require('../models/local.model');

const Orders = require('../models/orders.model');

//* validation usuers / validacion de usuarios

exports.validationUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Users.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`The User with id:${id} has not found `, 404));
  }

  req.user = user;
  next();
});

exports.validationUserSession = catchAsync(async (req, res, next) => {
  const { userSession } = req;

  const user = await Users.findOne({
    where: {
      id: userSession.id,
      status: 'active',
    },
    include: [
      {
        model: Orders,
        attributes: {
          exclude: ['mealId', 'userId', 'status', 'updatedAt', 'createdAt'],
        },
        include: [
          {
            model: Meals,
            attributes: {
              exclude: [
                'status',
                'restaurantId',
                'userId',
                'updatedAt',
                'createdAt',
              ],
            },
            include: [
              {
                model: Local,
                attributes: {
                  exclude: ['status', 'updatedAt', 'createdAt'],
                },
              },
            ],
          },
        ],
      },
    ],
  });

  if (!user) {
    return next(new AppError(`User with id:${id} has not found `, 404));
  }

  req.user = user;
  next();
});
