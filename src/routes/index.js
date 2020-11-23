const express = require('express');
const router  = express.Router();

const image   = require('../controllers/image.js');
const home    = require('../controllers/home.js');

module.exports = app =>{
  //ENRUTADORES

  router.get('/', home.index);
  //para llamar una imagen directamente desde la direccion
  router.get('/images/:image_id', image.index);
  //para llamar una imagen directamente desde la direccion
  router.post('/images', image.create);
  //para dar like a la imagen
  router.post('/images/:image_id/like', image.like);
  //comentario
  router.post('/images/:image_id/comment', image.comment);
  //eliminar 
  router.delete('/images/:image_id', image.remove);
  //ya usa el router
  app.use(router);
};
