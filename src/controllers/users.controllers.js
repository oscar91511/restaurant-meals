const catchAsync = require('../utils/catchAsync');
const Users = require('../models/users.model');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

//* signup users / registro de usuarios

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const userInDb = await Users.findOne({
    where: {
      email,
    },
  });

  if (userInDb) {
    return res.status(404).json({
      status: 'error',
      message: `sorry the user created with this email already exists ${email}`,
    });
  }

  const user = await Users.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role,
  });

  //* token generated / token de seguridad jwt

  const token = await generateJWT(user.id);

  res.status(201).json({
    message: 'User created successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

//* Logiin users / acceso de usuario

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Users.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`User with email:${email} was not found`, 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError(`Wrong email or password`, 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

//* find order user by id / peticion ordenes de usuario por id

exports.findOneOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  const filteredOrder = user.orders.filter((order) => order.id === +id);

  if (filteredOrder.length === 0) {
    return next(new AppError(`The order with id:${id} does not exist`));
  }

  res.status(200).json({
    status: 'success',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    order: filteredOrder,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });

  res.status(200).json({
    status: 'success',
    message: `The user with id:${user.id} was updated`,
    user: {
      name,
      email,
    },
  });
});

exports.findOrdersByUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    results: user.orders.length,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    orders: user.orders,
    meals: user.meals,
    restaurants: user.restaurants,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'disabled' });

  res.status(200).json({
    status: 'success',
    message: `User with id:${user.id} has been deleted`,
  });
});
