var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

var db = require('../lib/database.js');

// Render the login template
router.get('/login',
  function(req, res){
    res.redirect('https://jnallard.auth0.com/login?client=uW0cSjNzdKUFXgQScFdCLHApJCpJqZyd&redirect_uri=http://' + req.get('host') + '/callback');
  });

// Perform session logout and redirect to homepage
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to '/user'
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {

    db.query("select * from users where auth0Name = '" + req.user.id + "' LIMIT 1;", function(results){
      console.log(results);
      if(results.length != 0) return;

      db.query("insert into users (name, picture, auth0Name) values ('" + req.user.nickname + "', '" + req.user.picture + "', '" + req.user.id + "');", function(results){
      });
    });
    res.redirect(req.session.returnTo || '/');
  });

module.exports = router;
