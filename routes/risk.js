var express = require('express');
var config = require('../lib/config');
var router = express.Router();
const https = require('https');

var request = require('request');

var db = require('../lib/database.js');

router.get('/cells', function(req, res, next) {
  db.query("select * from riskCells;", function(results){
    res.send(results);
  });
});

module.exports = router;
