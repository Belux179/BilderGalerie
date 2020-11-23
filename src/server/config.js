//modulo path, es para unir direcctorios
const path = require('path');
//importar explesshandlebars
const exphbs = require('express-handlebars')

const morgan = require('morgan');
const multer = require('multer');
const express = require('express');

const erroHandler = require('errorHandler');

const routes = require('../routes/index')


module.exports = (app) => {

  //configurar el puerto
  app.set('port', process.env.PORT || 3000 );
  //carpetas de vistas
  app.set('views',path.join(__dirname, '../views'));
  //motor de plantillas es mas para el uso de hbs para facilitarnos
  app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    partialsDir: path.join(app.get("views"), "partials"),
    layoutsDir: path.join(app.get("views"), "layouts"),
    extname: '.hbs',
    helpers: require('./helpers')

  }))
  app.set('view engine', '.hbs');
  //middlewares
  app.use(morgan('dev'));
  app.use(multer({dest: path.join(__dirname,'../public/upload/temp')}).single('image'));
  app.use(express.urlencoded({extended: false}));
  app.use(express.json());

  routes(app);

  //archivos estaticos
  app.use('/public',express.static(path.join(__dirname,'../public')));
  //para errores
  if('development' === app.get('env')){
    app.use(erroHandler);
  }
  return app;
}
