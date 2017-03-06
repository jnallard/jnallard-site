var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var session = require('express-session')
var Auth0Strategy = require('passport-auth0');

var config = require('./lib/config.js');

// Configure Passport to use Auth0
var strategy = new Auth0Strategy({
    domain:       "jnallard.auth0.com",
    clientID:     "uW0cSjNzdKUFXgQScFdCLHApJCpJqZyd",
    clientSecret: config.getAuth0ClientSecret(),
    callbackURL:  "/callback"
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use(function(req, res, next) {
  if (req.user) {
    // logged in
    next();
  } else {
    res.redirect('/login');
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
