var express = require('express');
var bodyParser = require('body-parser');
var connectionDB = require('./models/connectionDB');
var session = require('express-session');
var cookieParser = require("cookie-parser");

var app = express();

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/NBAD_Project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DB connected");
});

app.use(cookieParser());
app.use(session({
  secret: "NBAD-milestone4",
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));
app.use('/images', express.static('images'));

app.use(bodyParser.urlencoded({
  extended: true
}));

var checkForLoggedInUser = function(req, res, next) {
  if(req.session.userProfile != undefined){
      req.isLoggedIn = true;
      let userFromSession = JSON.parse(req.session.user);
      req.firstName = userFromSession.FirstName;
  }
  else{
    req.isLoggedIn = false;
  }
  next();
};

app.use(checkForLoggedInUser);

var UserRoute = require('./routes/userRoutes.js');
app.use('/userRoutes', UserRoute);

var indexroute = require('./routes/index.js');
app.use('/index', indexroute);

var connectionsroute = require('./routes/connections.js');
app.use('/connections', connectionsroute);

var connectionroute = require('./routes/connection.js');
app.use('/connection', connectionroute);

var savedConnectionsroute = require('./routes/savedConnections.js');
app.use('/savedConnections', savedConnectionsroute);

var newConnectionroute = require('./routes/newConnection.js');
app.use('/newConnection', newConnectionroute);

var UserControllerroute = require('./routes/UserController.js');
app.use('/UserController', UserControllerroute);

app.get('/contact', function(req, res) {
  res.render('contact', {isLoggedIn:req.isLoggedIn,
  firstName : req.firstName});
});

app.get('/about', function(req, res) {
  res.render('about', {isLoggedIn:req.isLoggedIn,
  firstName : req.firstName});
});

app.use('/', indexroute);

app.listen(3000, function() {
  console.log('app started');
  console.log('listening to port 3000');
});
