const validationsMiddleware = require('../middlewares/validation.middleware');
const ordersController = require('../controllers/orders.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const ordersMiddleware = require('../middlewares/orders.middleware');

const router = Router();
const { Router } = require('express');

router.use(authMiddleware.protects);

router.post(
  '/',
  validationsMiddleware.orderValidation,
  ordersController.createNewOrder
);

router.get('/me', ordersController.findOrders);

router
  .use(
    '/:id',
    authMiddleware.protectAccountOwnerByOrder,
    ordersMiddleware.validationOrder
  )
  .route('/:id')
  .patch(ordersController.updateOrder)
  .delete(ordersController.deleteOrder);

module.exports = router;
