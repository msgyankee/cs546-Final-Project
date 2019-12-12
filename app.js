const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const session = require('express-session');
const uuidv1 = require('uuid/v1');
const data = require('./data/data');
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Use session cookie
app.use(session({
    name: 'AuthCookie',
    secret: 'very scret string!',
    resave: false,
    saveUninitialized: true
  }));

//Middleware
app.use('/create', function(request, response, next){
  if(!request.session.loginStatus) response.status(403).render('pages/login');
  else{next();}
});


//Routes
configRoutes(app);

//Server
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});

