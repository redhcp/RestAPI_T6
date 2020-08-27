const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');




//connection to db
// MongoClient.connect('mongodb://localhost/crud-mongo',{ useNewUrlParser: true })
mongoose.connect('mongodb://localhost/tp')
  .then(db => console.log('db connected'))
  .catch(err => console.log(err));

  
//INICIAL

const app = express();
require('./passport/local-auth');
// require('./database');

// importing routes
const indexRoutes = require('./routes/index');
const contactosRoutes = require('./routes/contactos');
const revistasRoutes = require('./routes/revistas');
const suscripcionesRoutes = require('./routes/suscripciones');
const edicionesRoutes = require('./routes/ediciones');
const contactos = require('./model/contactos');



// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// mmiddlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(session({
  secret: 'mysecretsession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  
  next();
});

// routes
// app.use('/signin', contactos);
app.use('/', indexRoutes);
app.use('/', contactosRoutes);
app.use('/', revistasRoutes);
app.use('/', suscripcionesRoutes);
app.use('/', edicionesRoutes);

//Escuchando puerto 
app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`);
});

