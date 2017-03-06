var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

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
    res.redirect(req.session.returnTo || '/');
  });

module.exports = router;
