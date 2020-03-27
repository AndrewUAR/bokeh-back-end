const express = require('express');
const photographerController = require('../controllers/photographerController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(photographerController.getAllPhotographers)
  .post(authController.protect, photographerController.createPhotographer);

router
  .route('/:id')
  .get(photographerController.getPhotographer)
  .patch(authController.protect, photographerController.updatePhotographer)
  .delete(authController.protect, photographerController.deletePhotographer);

module.exports = router;
