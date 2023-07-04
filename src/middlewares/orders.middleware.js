const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Local = require('../models/local.model');
const Meals = require('../models/meals.model');
const Orders = require('../models/orders.model');

exports.validationOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const orderComplete = await Orders.findOne({
    where: {
      id,
      status: 'completed',
    },
  });

  if (orderComplete) {
    return next(new AppError(`Order with id:${id} has completed.`));
  }

  const order = await Orders.findOne({
    where: {
      id,
      status: 'active',
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'status'],
    },
    include: [
      {
        model: Meals,
        include: [
          {
            model: Local,
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'status'],
            },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'status'],
        },
      },
    ],
  });

  if (!order) {
    return next(new AppError(`this id:${id} order has not found `, 404));
  }

  req.order = order;
  next();
});
