var express = require('express');
var router = express.Router();


router.use(function(req, res, next) {
  if(req.session.userProfile != undefined){
      req.isLoggedIn = true;
      let userFromSession = JSON.parse(req.session.user);
      req.firstName = userFromSession.FirstName;
  }
  else{
    req.isLoggedIn = false;
  }
  next();
});

router.get('/', function(req, res) {
  res.render('index', {isLoggedIn:req.isLoggedIn,
  firstName : req.firstName});
});

module.exports = router;
