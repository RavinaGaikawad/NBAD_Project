var express = require('express');
var router = express.Router();
var UserProfile = require('../models/UserProfileDB');
var connectionDB = require('../models/connectionDB.js');

var sessionuserprofile;
var userprofile;

//middleware
var getObjectFromSession = function(req, res, next) {
  if (req.session.userProfile != undefined) {
    sessionuserprofile = JSON.parse(req.session.userProfile);
    req.isLoggedIn = true;
    let userFromSession = JSON.parse(req.session.user);
    req.firstName = userFromSession.FirstName;
    userprofile = new UserProfile(sessionuserprofile.UserID, sessionuserprofile.UserConnectionList);
  }
  next();
}

router.use(getObjectFromSession);


router.all('/', function(req, res) {
  //check if query is not empty
  if (Object.keys(req.query).length == 0) {
    if (req.isLoggedIn) {
      res.render('savedConnections', {
        data: sessionuserprofile,
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
