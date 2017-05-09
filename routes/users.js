var express = require('express');
var config = require('../lib/config');
var router = express.Router();
const https = require('https');

var request = require('request');

var token = null;
var tokenExpires = Date.now;

function getToken(cb){
  if(Date.now >= tokenExpires){
    request.post(
      {
        url: 'https://jnallard.auth0.com/oauth/token',
        json: {
          grant_type: 'client_credentials',
          client_id: 'uW0cSjNzdKUFXgQScFdCLHApJCpJqZyd',
          client_secret: config.getAuth0ClientSecret(),
          "audience": "https://jnallard.auth0.com/api/v2/"

        } ,
        headers: {
          "content-type": "application/json"
        }
      },
      function (error, response, body) {
        //console.log(response);
        console.log(response.statusCode);
          if (!error && response.statusCode == 200) {
              console.log(body);
              cb(body.access_token);
          }
          else{
            console.log("error" + error);
            cb(false);
          }
      }
    );
  }
  else{
    cb(token);
  }
}
getToken(function(auth0_token){
  token = auth0_token;
});

var db = require('../lib/database.js');

router.get('/', function(req, res, next) {
  db.query("select * from users;", function(results){
    res.send(results);
  });
});

router.get('/auth0', function(req, res, next) {
  request.get(
    {
      url: 'https://jnallard.auth0.com/api/v2/users',
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + token
      }
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var users = [];
          body = JSON.parse(body);
          body.forEach(function(user, index){
            var user_copy = {
              name: user.name,
              picture: user.picture
            }
            users.push(user_copy);
          });

          console.log(users);
          res.send(users);
        }
        else{
          //console.log(error);
          next(error);
        }
    }
  );
});

router.get('/me', function(req, res, next) {
  db.query("select * from users where auth0Name = '" + req.user.id + "' LIMIT 1;", function(results){
    var message = {
      auth0: req.user,
      db: results
    };
    res.send(message);
  });
});



router.post('/me', function(req, res, next) {
  console.log(req.body);

  db.query("update users set name = " + db.escape(req.body.name) + ", picture = " + db.escape(req.body.picture) + " where auth0Name = '" + req.user.id + "' ;", function(results){
    res.send(results);
  });
});

module.exports = router;
