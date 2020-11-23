//es para el objetos tanto de nombre aleatorio etc
const {randomNumber} = require('../helpers/libs');
//es para la extension de la imagen
const path = require('path');
//todo que mantengan las imagenes
const ctrl = {};
//esto es para la imagen de gravatar
const md5 = require('md5');
//me ayuda para mover
const fs = require(`fs-extra`);
//ya para el uso en la BD
const {Image,Comment} = require(`../models`);
const { json } = require('express');


ctrl.index = async(req, res) =>{
  
  const imae = await Image.findOne({filename: { $regex: req.params.image_id }});
  if(imae){
    imae.views = imae.views + 1;
    await imae.save();
    const image = await Image.findOne({filename: { $regex: req.params.image_id }}).lean();
    const comments = await Comment.find({image_id:image._id}).lean();
    
    //console.log(image);
    //console.log(req.params.image_id);
    res.render('image',{image, comments});
  }else{
    res.redirect('/');
  }
  
};
ctrl.create = (req, res) => {
  //recursion si se repite de nuevo el nombre
  const saveImage = async() => {
    //para el nombre aleatorio de acuerdo con la funcion
    const imgUrl = randomNumber();
    //verfica si el nombre no se repite
    const images = await Image.find({filename:imgUrl});
    if(images.length>0){
      saveImage();
    }else{
       //
      const imageTempPath = req.file.path;

      //solo es para sacar la extension, solo el .png o .jpg
      const ext = path.extname(req.file.originalname).toLowerCase();
      //ubicacion ya con la ext y con un nombre aleatorio
      const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

      if(ext ==='.png'||ext ==='.jpg'||ext ==='.jpeg'||ext ==='.gif'){
        await fs.rename(imageTempPath, targetPath);
        const newImg = new Image({
          title: req.body.title,
          filename: imgUrl + ext,
          description: req.body.description,
          uniqueID: imgUrl
        });
         console.log(newImg);
        const imageSaved = await newImg.save();
       res.redirect('/images/' + imageSaved.uniqueId);
      } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({error: 'Solo Imagenes ext: .png .jpg .jpeg .gif'});
      } 
      //res.send('funcionando');
    }
   
  };
  saveImage();  
  

};
ctrl.like = async(req, res) => {
  const image = await Image.findOne({filename:{$regex: req.params.image_id}});  
  if(image){
    image.likes = image.likes + 1;
    await image.save();
    res.json({likes: image.likes});
  }else{
    res.status(500).json({error: 'Internal Error'});
  }
};

ctrl.comment = async(req, res) => {
  const image = await Image.findOne({filename:{$regex: req.params.image_id}}).lean();
  //const newComment = new Comment(req.body);
  //console.log(req.body);
  if(image){
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    //console.log(newComment);
    await newComment.save();
    res.redirect('/images/' + image.uniqueID);
  }else{
    res.redirect('/');
  }
  
  // */
  //console.log(newComment);
  //console.log(req.params.image_id);
  //res.send('comentario');
  //console.log(req.params.image_id);
  
};
ctrl.remove = async(req, res) => {
  //console.log(req.param.image_id)
  const image = await Image.findOne({filename: {$regex: req.params.image_id}});
  if (image) {
    await fs.unlink(path.resolve('./src/public/upload/' + image.filename));
    await Comment.deleteOne({image_id: image._id});
    await image.remove();
    res.json(true);
  } else {
    res.json({response: 'Fallo .'})
  }  

};
module.exports =ctrl;
