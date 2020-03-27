const express = require('express');
const albumController = require('../controllers/albumController');

const router = express.Router();

router
  .route('/')
  .get(albumController.getAllAlbums)
  .post(albumController.createAlbum);

router
  .route('/:id')
  .get(albumController.getAlbum)
  .patch(
    albumController.uploadAlbumImages,
    albumController.resizeAlbumImages,
    albumController.updateAlbum
  )
  .delete(albumController.deleteAlbum);

module.exports = router;
