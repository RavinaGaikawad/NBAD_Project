var express = require('express');
var router = express.Router();
var savedConnectionsroute = require('./savedConnections.js');
var connectionDB = require('../models/connectionDB.js');
var User = require('../models/User');
var UserProfile = require('../models/UserProfileDB');
var userconnectionModel = require('../models/userconnection');
var bodyParser = require("body-parser");
var UserDB = require('../models/UserDB');

var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

var sessionuserprofile;
var userprofile;
var user;

//validate session
router.use(function(req, res, next) {
  if (req.session.userProfile != undefined) {
    sessionuserprofile = JSON.parse(req.session.userProfile);
    req.isLoggedIn = true;
    user = JSON.parse(req.session.user);
    req.firstName = user.FirstName;
    userprofile = new UserProfile(user.UserID, sessionuserprofile);
  }
  next();
});

//Get Login request
router.get('/login', function(req, res) {
  res.render('login', {
    isLoggedIn: req.isLoggedIn,
    firstName: req.firstName,
    error: undefined
  });
});

//Logout request
router.get('/Logout', function(req, res) {
  req.session.destroy();
  res.render('index', {
    isLoggedIn: false,
    firstName: req.firstName
  });
});

//Post Login request
router.post('/Login', async function(req, res, next) {
  //get session to check if it has been initialized
  var sessionUserProfile = req.session.UserProfile;

  if (sessionUserProfile == null) {
    let userFromDB = await UserDB.getUserByUsernameAndPassword(req.body.username, req.body.password);
    if(userFromDB.length == 0 || userFromDB == null){
      //show login page with errors
      let errormsg = "Invalid User. Either Username or Password is incorrect.";
      res.render('login', {
        isLoggedIn: req.isLoggedIn,
        firstName: undefined,
        error:errormsg
      });
    }
    else{
      var user = userFromDB[0];
      req.firstName = user.FirstName;
      let userprofile = new UserProfile(user.UserID, []);
      var getdata = await userprofile.getUserConnections(user.UserID);
      req.session.userProfile = JSON.stringify(getdata);
      req.session.user = JSON.stringify(user);
      req.isLoggedIn = true;

      res.render('savedConnections', {
        data: getdata,
        isLoggedIn: req.isLoggedIn,
        firstName: req.firstName
      });
    }
  }
  else{
    res.render('savedConnections', {
      data: getdata,
      isLoggedIn: req.isLoggedIn,
      firstName: req.firstName
    });
  }
});

//save update delete Connection
router.all('/', async function(req, res) {
  //check if query is not empty
  if (Object.keys(req.query).length > 0 && req.isLoggedIn) {
    if (req.query.action == "save") {
      //check if connection already exists

      //validating connection id
      let isExists = false;
      let connectionlistDB = await connectionDB.getConnections();
      connectionlistDB.forEach((item, i) => {
        if (item.connectionID == req.query.connectionID){
          isExists = true;
        }
      });

      if(isExists){
        let connectionObj = await connectionDB.getConnection(req.query.connectionID);
        if (await userprofile.connectionExists(connectionObj, user.UserID)) {
          userprofile.updateRSVP(connectionObj, req.query.rsvp, user.UserID);
        } else {
          var userconnectionID = await userprofile.addUserConnection(connectionObj, req.query.rsvp, user.UserID);
          await userprofile.addRSVP(user.UserID, userconnectionID, req.query.rsvp);
        }
        let data = await userprofile.getUserConnections(user.UserID);
        req.session.userProfile = JSON.stringify(data);
        res.render('savedConnections', {
          data: data,
          isLoggedIn: req.isLoggedIn,
          firstName: req.firstName
        });
      }
      else{
        res.render('404NotFound', {isLoggedIn:req.isLoggedIn,
        firstName : req.firstName});
      }
    }
    else if (req.query.action == "update") {

      //validating connection id
      let isExists = false;
      let connectionlistDB = await connectionDB.getConnections();
      connectionlistDB.forEach((item, i) => {
        if (item.connectionID == req.query.connectionID){
          isExists = true;
        }
      });

      if (isExists){
        let connectionObj = await connectionDB.getConnection(req.query.connectionID);
        await userprofile.updateRSVP(connectionObj, req.query.rsvp, user.UserID);

        let data = await userprofile.getUserConnections(user.UserID);
        req.session.userProfile = JSON.stringify(data);
        res.render('savedConnections', {
          data: data,
          isLoggedIn: req.isLoggedIn,
          firstName: req.firstName
        });
      }
      else{
        res.render('404NotFound', {isLoggedIn:req.isLoggedIn,
        firstName : req.firstName});
      }
    }
     else if (req.query.action == "delete") {
      //validating connection id
      let isExists = false;
      let connectionlistDB = await userprofile.getUserConnections(user.UserID);
      connectionlistDB.forEach((item, i) => {
        if (item.Connection.connectionID == req.query.connectionID){
          isExists = true;
        }
      });

      if(isExists){
        let connectionObj = await connectionDB.getConnection(req.query.connectionID);
        await userprofile.removeConnection(connectionObj, user.UserID);
        let data = await userprofile.getUserConnections(user.UserID);
        req.session.userProfile = JSON.stringify(data);
        res.render('savedConnections', {
          data: data,
          isLoggedIn: req.isLoggedIn,
          firstName: req.firstName
        });
      }
      else{
        res.render('404NotFound', {isLoggedIn:req.isLoggedIn,
        firstName : req.firstName});
      }
    }
  } else {
    if (req.isLoggedIn) {
      res.render('savedConnections', {
        data: getdata,
        isLoggedIn: req.isLoggedIn,
        firstName: req.firstName
      });
    } else {
      res.render('login', {
        isLoggedIn: req.isLoggedIn,
        firstName: req.firstName,
        error: undefined
      });
    }
  }
});

module.exports = router;
