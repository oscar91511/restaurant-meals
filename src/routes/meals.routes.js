const validationsMiddleware = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const LocalRestMiddleware = require('../middlewares/local.middleware');
const mealsMiddleware = require('../middlewares/meals.middleware');
const mealsControllers = require('../controllers/meals.controller');

const { Router } = require('express');
const router = Router();

router.get('/', mealsControllers.findMeals);

router.post(
  '/:id',
  authMiddleware.protects,
  authMiddleware.restrictTo('admin'),
  validationsMiddleware.MealValidation,
  LocalRestMiddleware.validationRestaurant,
  mealsControllers.createNewMeal
);

router
  .use('/:id', mealsMiddleware.validMeal)
  .route('/:id')
  .get(mealsControllers.findMealById)
  .patch(
    authMiddleware.protects,
    authMiddleware.restrictionTo('admin'),
    validationsMiddleware.MealValidation,
    mealsControllers.updateMeal
  )
  .delete(
    authMiddleware.protects,
    authMiddleware.restrictionTo('admin'),
    mealsControllers.deleteMeal
  );

module.exports = router;