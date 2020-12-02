var express = require('express');
var router = express.Router();
var url = require('url');

var checkForLoggedInUser = function(req, res, next) {
  if (req.session.userProfile != undefined) {
    req.isLoggedIn = true;
    let userFromSession = JSON.parse(req.session.user);
    req.firstName = userFromSession.FirstName;
    next();
  } else {
    req.isLoggedIn = false;
  }
  next();
};

router.use(checkForLoggedInUser);

router.post('/Login', function(req, res, next) {
  res.redirect(307, '/UserController/login');
});

router.get('/Logout', function(req, res) {
  res.redirect('/UserController/Logout');
});

router.post('/newConnection', function(req, res) {
  res.redirect(307, url.format({
    pathname: "/newConnection",
    query: req.query
  }));
});

router.use(function(req, res, next) {
  if (req.method === "POST") {
    var connectionlist = req.body.connectionlist;
    var connectionID = req.body.connectionID;
    //checking for bonus point
    if (connectionlist != undefined && connectionID != undefined) {
      if (connectionlist.includes(connectionID)) {
        next();
      } else {
        res.render('404NotFound', {isLoggedIn:req.isLoggedIn,
        firstName : req.firstName});
      }
    }
  }
  next();
});

router.get('/connection/save', function(req, res) {
  res.redirect(url.format({
    pathname: "/UserController",
    query: req.query
  }));
});

router.post('/connection/update/:conID', function(req, res, next) {
  var conID = req.params.conID;
  res.redirect('/connection/update/' + conID);
});

router.post('/connection/delete', function(req, res) {
  res.redirect(url.format({
    pathname: "/UserController",
    query: req.query
  }));
});

module.exports = router;
