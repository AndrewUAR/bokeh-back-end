const express = require('express');
const photographerController = require('../controllers/photographerController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/').get(photographerController.getAllPhotographers);


router.get(
  '/myProfile',
  authController.protect,
  authController.restrictTo('photographer'),
  userController.getMe,
  photographerController.getPhotographer
  );
  
router.route('/:id').get(photographerController.getPhotographer);

router.use(authController.protect);

router.patch(
  '/createProfile',
  authController.restrictTo('user'),
  userController.getMe,
  photographerController.createPhotographerProfile
);
router.patch(
  '/updateProfile',
  authController.restrictTo('photographer'),
  userController.getMe,
  photographerController.updatePhotographerProfile
);
router.patch(
  '/activateProfile',
  authController.restrictTo('photographer'),
  userController.getMe,
  photographerController.activateProfile
);
router.patch(
'/hideProfile',
  authController.restrictTo('photographer'),
  userController.getMe,
  photographerController.deactivateProfile
);

module.exports = router;
