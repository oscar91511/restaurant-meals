const authMiddleware = require('../middlewares/auth.middleware');
const validationsMiddleware = require('../middlewares/validation.middleware');

const restaurantsMiddleware = require('../middlewares/local.middleware');
const localRestController = require('../controllers/local.controller');

const router = Router();
const { Router } = require('express');


router
  .route('/')
  .get(localRestController.findLocal)
  .post(
    authMiddleware.protects,
    authMiddleware.restrictionTo('admin'),
    validationsMiddleware.createLocalRestaurantValidation,
    localRestController.createNewLocal
  );

router
  .route('/reviews/:restaurantId/:id')
  .patch(
    authMiddleware.protects,
    authMiddleware.protectAccountOwnerByReview,
    validationsMiddleware.validationReviews,
    restaurantsMiddleware.validationReview,
    localRestController.updateReviews
  )
  .delete(
    authMiddleware.protects,
    authMiddleware.protectAccountOwnerByReview,
    restaurantsMiddleware.validationReview,
    localRestController.deleteReviews
  );

router.post(
  '/reviews/:id',
  authMiddleware.protects,
  validationsMiddleware.validationReviews,
  restaurantsMiddleware.validationRestaurant,
  localRestController.createsNewsReviews
);

router.use('/:id', restaurantsMiddleware.validationRestaurant);

router
  .route('/:id')
  .get(localRestController.findLocalRestaurantById)
  .patch(
    authMiddleware.protects,
    authMiddleware.restrictionTo('admin'),
    validationsMiddleware.updateLocalRestaurantValidation,
    localRestController.updateLocalRestaurant
  )
  .delete(
    authMiddleware.protects,
    authMiddleware.restrictionTo('admin'),
    localRestController.deleteLocalRestaurant
  );

module.exports = router;