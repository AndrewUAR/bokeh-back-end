const express = require('express');
const photoSessionController = require('../controllers/photoSessionController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(photoSessionController.getAllPhotoSessions)
  .post(
    photoSessionController.uploadCoverImage,
    photoSessionController.resizeCoverImage,
    photoSessionController.createPhotoSession
  );

router
  .route('/:id')
  .get(photoSessionController.getPhotoSession)
  .patch(
    photoSessionController.uploadCoverImage,
    photoSessionController.resizeCoverImage,
    photoSessionController.updatePhotoSession
  )
  .delete(photoSessionController.deletePhotoSession);

module.exports = router;
