const express = require('express');
const photoSessionController = require('../controllers/photoSessionController');

const router = express.Router();

router
  .route('/')
  .get(photoSessionController.getAllphotoSession)
  .post(photoSessionController.createPhotoSession);

router
  .route('/:id')
  .get(photoSessionController.getPhotoSession)
  .patch(photoSessionController.updatePhotoSession)
  .delete(photoSessionController.deletePhotoSession);

module.exports = router;
