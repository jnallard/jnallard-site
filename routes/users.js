var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

var db = require('../lib/database.js');

// Get the user profile
router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('user', { user: req.user });
});

router.get('/users', function(req, res, next) {
  db.getUsers(function(users){
    res.send(users);
  })
});

module.exports = router;
