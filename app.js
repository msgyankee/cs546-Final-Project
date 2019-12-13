const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const session = require('express-session');
const configRoutes = require('./routes');


app.use(express.json());
app.use(express.urlencoded({extended: true}));

let hbs = exphbs.create({
  helpers: {
    'if_eq': function(a,b) { if(a === b) return true; else{ return false; }}
  },
  defaultLayout: 'main'
});

//app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


//Use session cookie
app.use(session({
    name: 'AuthCookie',
    secret: 'very scret string!',
    resave: false,
    saveUninitialized: true,
    httpOnly: false
  }))

//Middleware
app.use('/create', function(request, response, next){
  if(!request.session.loginStatus) response.status(403).redirect('/login');
  else{next();}
});


//Routes
configRoutes(app);

//Server
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});

