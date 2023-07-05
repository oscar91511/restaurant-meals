const authMiddleware = require('../middlewares/auth.middleware');
const usersController = require('../controllers/users.controllers');
const validationsMiddleware = require('../middlewares/validation.middleware');

const usersMiddleware = require('../middlewares/users.middleware');



const { Router } = require('express');
const router = Router();

router.post(
  '/signup',
  validationsMiddleware.createValidationUsers,
  usersController.signup
);

router.post(
  '/login',
  validationsMiddleware.loginValidationUsers,
  usersController.login
);

router.use(authMiddleware.protects);

router.get(
  '/orders',
  usersMiddleware.validationUserSession,
  usersController.findOrdersByUser
);

router.get(
  '/orders/:id',
  usersMiddleware.validationUserSession,
  usersController.findOneOrderById
);

router.use('/:id', usersMiddleware.validationUser);

router
  .use(authMiddleware.protectAccountOwner)
  .route('/:id')
  .patch(validationsMiddleware.updateValidationUsers, usersController.updateUser)
  .delete(usersController.deletedUser);

module.exports = router;