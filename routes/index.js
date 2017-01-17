var express = require('express');
var router = express.Router();

var db = require('../lib/database.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/users', function(req, res, next) {
  db.getUsers(function(users){
    res.send(users);
  })
});

module.exports = router;
