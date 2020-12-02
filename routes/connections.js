var express = require('express');
var router = express.Router();
var connectionDB = require('../models/connectionDB.js');
var connection_categories;

var checkForLoggedInUser = function(req, res, next) {
  if(req.session.userProfile != undefined){
      req.isLoggedIn = true;
      let userFromSession = JSON.parse(req.session.user);
      req.firstName = userFromSession.FirstName;
  }
  next();
};

router.use(checkForLoggedInUser);

router.get('/',async function(req, res) {
  var connectionlist = await connectionDB.getConnections();
  var connection_categories = await connectionDB.getConnectionCategories();
  res.render('connections', {
    'conlist': connectionlist,
    'con_category': connection_categories,
    isLoggedIn:req.isLoggedIn,
    firstName : req.firstName
  });

});


module.exports = router;
