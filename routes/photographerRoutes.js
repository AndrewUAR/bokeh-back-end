const express = require('express');
const photographerController = require('../controllers/photographerController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/').get(photographerController.getAllPhotographers);
router.route('/:id').get(photographerController.getPhotographer);

router.use(authController.protect);

router.route(
  '/createProfile',
  authController.restrictTo('photographer'),
  userController.getMe,
  photographerController.createPhotographerProfile
);
router.route(
  '/updateProfile',
  authController.restrictTo('user'),
  userController.getMe,
  photographerController.updatePhotographerProfile
);
router.route(
  '/activateProfile',
  authController.restrictTo('photographer'),
  userController.getMe,
  photographerController.activateProfile
);
router.route(
  '/hideProfile',
  authController.restrictTo('user'),
  userController.getMe,
  photographerController.deactivateProfile
);

module.exports = router;
