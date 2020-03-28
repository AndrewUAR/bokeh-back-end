const express = require('express');
const albumController = require('../controllers/albumController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(albumController.getAllAlbums)
  .post(albumController.createAlbum);

router
  .route('/:id')
  .get(albumController.getAlbum)
  .patch(albumController.updateAlbum)
  .delete(albumController.deleteAlbum);

router.patch(
  '/:id/uploadImage',
  albumController.uploadAlbumImages,
  albumController.resizeAlbumImages,
  albumController.updateAlbumImage
);

router.patch('/:id/deleteImage', albumController.deleteAlbumImage);

module.exports = router;
