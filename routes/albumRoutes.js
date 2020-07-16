const express = require('express');
const albumController = require('../controllers/albumController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController')

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('photographer'), userController.getMe, albumController.getAllMyAlbums)
  // .get(authController.restrictTo('photographer'), albumController.setPhotographerId, albumController.getAllAlbums)
  .post(authController.restrictTo('photographer'), albumController.setPhotographerId, albumController.createAlbum);



router
  .route('/:id')
  .get(albumController.getAlbum)
  .patch(authController.restrictTo('photographer'), albumController.updateAlbum)
  .delete(authController.restrictTo('photographer'),  albumController.deleteAlbum);

router.patch(
  '/:id/uploadImages',
  albumController.uploadAlbumImages,
  albumController.resizeAlbumImages,
  albumController.updateAlbumImage
);

router.patch('/:id/deleteImages', albumController.deleteAlbumImage);

module.exports = router;
