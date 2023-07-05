const Orders = require('../models/orders.model');
const Meals = require('../models/meals.model');
const Local = require('../models/local.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createNewOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const { id } = req.sessionUser;

  const meal = await Meals.findOne({
    where: {
      id: mealId,
      status: 'active',
    },
    include: [
      {
        model: Local,
        attributes: {
          exclude: ['status', 'updatedAt', 'createdAt'],
        },
      },
    ],
  });

  if (!meal) {
    return next(new AppError('meal is non exist', 404));
  }

  const totalPrice = meal.price * quantity;

  const order = await Orders.create({
    mealId,
    quantity,
    totalPrice,
    userId: id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Order has been created successfully',
    order: {
      id: order.id,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
    },
    meal: {
      id: meal.id,
      name: meal.name,
      price: meal.price,
      restaurant: meal.restaurant,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  const updatedOrder = await order.update({ status: 'completed' });
  res.status(201).json({
    status: 'success',
    message: 'Order has been updated.',
    updatedOrder: {
      id: order.id,
      totalPrice: order.totalPrice,
      meal: order.meal.name,
      status: order.status,
    },
  });
});

exports.findOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Orders.findAll({
    where: {
      status: 'active',
      userId: sessionUser.id,
    },
    attributes: {
      exclude: ['status', 'mealId', 'userId', 'updatedAt', 'createdAt'],
    },
    include: [
      {
        model: Meals,
        include: [
          {
            model: Local,
            attributes: {
              exclude: ['status', 'updatedAt', 'createdAt'],
            },
          },
        ],
        attributes: {
          exclude: [
            'status',
            'restaurantId',
            'userId',
            'updatedAt',
            'createdAt',
          ],
        },
      },
    ],
  });

  res.status(201).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'cancelled' });
  res.status(201).json({
    status: 'success',
    message: 'Order has been deleted.',
  });
});
