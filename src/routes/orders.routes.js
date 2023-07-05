const validationsMiddleware = require('../middlewares/validation.middleware');
const ordersController = require('../controllers/orders.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const ordersMiddleware = require('../middlewares/orders.middleware');


const { Router } = require('express');
const router = Router();

router.use(authMiddleware.protects);

router.post(
  '/',
  validationsMiddleware.orderValidation, 
  ordersController.createNewOrder
);

router.get('/me', ordersController.findOrders); //* find orders / ruta para encontrar ordenes

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
