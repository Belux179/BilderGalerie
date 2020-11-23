const ctrl  = {};

const { Image } = require('../models');

ctrl.index =  async (req, res)=>{
   //res.send('<h1>Index paage</h1>');
   //ya para la lista y consulta de la bs
   const images = await Image.find().sort({timestamp: -1}).lean();
   res.render('index', {images});
   
};

module.exports = ctrl;
