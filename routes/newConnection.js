var express = require('express');
var router = express.Router();
var connectionDB = require('../models/connectionDB.js');
var UserProfile = require('../models/UserProfileDB');
const {check, validationResult} = require('express-validator');
var user;

var checkForLoggedInUser = function(req, res, next) {
  if (req.session.userProfile != undefined) {
    req.isLoggedIn = true;
    user = JSON.parse(req.session.user);
    req.firstName = user.FirstName;
    sessionuserprofile = JSON.parse(req.session.userProfile);
    userprofile = new UserProfile(sessionuserprofile.UserID, sessionuserprofile.UserConnectionList);
  }
  next();
};

router.use(checkForLoggedInUser);

router.get('/', function(req, res) {
  res.render('newConnection', {
    isLoggedIn: req.isLoggedIn,
    'firstName': req.firstName,
    errors : undefined
  });
});

router.post('/',[
  check('topic').matches(/^[a-z0-9 ]+$/i).withMessage('Topic must contain only letters and numbers'),
  check('name').matches(/^[a-z0-9 ]+$/i).withMessage('Name must contain only letters and numbers'),
  check('description').matches(/^[a-z0-9 ]+$/i).withMessage('Description must contain only letters and numbers'),
  check('date').custom((inputdate) => {
    if (connectionDB.isInValidDate(new Date(inputdate))) {
      return Promise.reject('Date of the event must be greater than or equal to current date.');
    }
    return true;
  }),
  check('starttime').not().isEmpty().withMessage('StartTime must not be empty'),
  check('endtime').not().isEmpty().withMessage('EndTime must not be empty'),
  check('endtime').custom((S, E) => {
    if (connectionDB.isValidTime(S, E)) {
      return Promise.reject('StartTime must be before EndTime');
    }
    return true;
  })
], async function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    res.render('newConnection', {
      isLoggedIn: req.isLoggedIn,
      'firstName': req.firstName,
      errors : errors.array()
    });
  }
  else{
    if (req.isLoggedIn) {
      let newcon = -1;

      let x = req.body.date;
      let dateObj = new Date(x);
      let date = connectionDB.getDay(dateObj.getDay()) + " " + connectionDB.getMonth(dateObj.getMonth()) + " " + (dateObj.getDate() + 1) + ", " + dateObj.getFullYear();

      let from = req.body.starttime;
      let end = req.body.endtime;

      let timefrom = connectionDB.formatAMPM(from);
      let timeend = connectionDB.formatAMPM(end);
      let time = timefrom + " - " + timeend;
      newcon = await connectionDB.addConnection(req.body.name, req.body.topic, user.FirstName + " " + user.LastName, req.body.location, req.body.description, date, time);
      let userconnectionID = await userprofile.addUserConnection(newcon, "Yes", user.UserID);
      await userprofile.addRSVP(user.UserID, userconnectionID, "Yes");

      let data = await userprofile.getUserConnections(user.UserID);
      req.session.userProfile = JSON.stringify(data);
      res.render('savedConnections', {
        data: data,
        isLoggedIn: req.isLoggedIn,
        'firstName': req.firstName
      });
    } else {
      res.render('login', {
        isLoggedIn: req.isLoggedIn,
        'firstName': req.firstName,
        error: undefined
      });
    }
  }
});

module.exports = router;
