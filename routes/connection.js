var express = require('express');
var router = express.Router();
var connectionDB = require('./../models/connectionDB');
var UserProfile = require('../models/UserProfileDB');
var userprofile;
var user;

router.use(function(req, res, next) {
  if(req.session.userProfile != undefined){
      req.isLoggedIn = true;
      user = JSON.parse(req.session.user);
      req.firstName = user.FirstName;
      sessionuserprofile = JSON.parse(req.session.userProfile);
      userprofile = new UserProfile(user.UserID, sessionuserprofile);
  }
  next();
});

//Gets all post and get requests to display connection page
router.get('/:conID', async function(req, res) {
  //validate connection id
  let isExists = false;
  let connectionlistDB = await connectionDB.getConnections();
  connectionlistDB.forEach((item, i) => {
    if (item.connectionID == req.params.conID){
      isExists = true;
    }
  });
  if (isExists){
    let item = await connectionDB.getConnection(req.params.conID);
    let connection_categories = await connectionDB.getConnectionCategories();
    if (item == -1) {
      let connectionlist = await connectionDB.getConnections();
      res.render('404NotFound', {
        isLoggedIn: req.isLoggedIn,
        firstName: req.firstName
      });
    } else {
      res.render('connection', {
        'connection': item,
        isLoggedIn:req.isLoggedIn,
        'isUpdate' : false,
        firstName : req.firstName
      });
    }
  }
  else{
    res.render('404NotFound', {isLoggedIn:req.isLoggedIn,
    firstName : req.firstName});
  }
});

router.get('/update/:conID',async function(req, res) {

  //validating connection id
  let isExists = false;
  let connectionlistDB = await userprofile.getUserConnections(user.UserID);
  connectionlistDB.forEach((item, i) => {
    if (item.Connection.connectionID == req.params.conID){
      isExists = true;
    }
  });

  if (isExists){
    let item = await connectionDB.getConnection(req.params.conID);
    let connection_categories = await connectionDB.getConnectionCategories();
    if (item == -1) {
      let connectionlist = await connectionDB.getConnections();
      res.render('404NotFound', {
        isLoggedIn: req.isLoggedIn,
        firstName: req.firstName
      });
    } else {
      res.render('connection', {
        'connection': item,
        isLoggedIn:req.isLoggedIn,
        'isUpdate' : true,
        firstName : req.firstName
      });
    }
  }
  else{
    res.render('404NotFound', {isLoggedIn:req.isLoggedIn,
    firstName : req.firstName});
  }
});

router.get('/*', function(req, res) {
  res.render('404NotFound', {isLoggedIn:req.isLoggedIn,
  firstName : req.firstName});
});

module.exports = router;
