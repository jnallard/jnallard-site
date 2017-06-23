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

router.post('/cells', function(req, res, next) {
  var body = req.body;
  db.query("update riskCells set owner=" + db.escape(req.body.owner) + ",  troops=" + db.escape(req.body.troops)
   + ",  revisionId=" + db.escape(req.body.revisionId + 1) + " where name=" + db.escape(req.body.name)
   + " and revisionId=" + db.escape(req.body.revisionId) + ";", function(results){

    console.log(results);
    if(results.affectedRows == 0){
      res.status(400).send("Cell Not Updated");
      return;
    }

    db.query("select * from riskCells where name=" + db.escape(req.body.name) + ";", function(results){
      res.send(results[0]);
    });
  });
});

module.exports = router;
