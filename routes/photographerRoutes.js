const express = require('express');
const photographerController = require('../controllers/photographerController');

const router = express.Router();

router
  .route('/')
  .get(photographerController.getAllPhotographers)
  .post(photographerController.createPhotographer);

router
  .route('/:id')
  .get(photographerController.getPhotographer)
  .patch(photographerController.updatePhotographer)
  .delete(photographerController.deletePhotographer);

module.exports = router;
