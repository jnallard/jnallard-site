var express = require('express');
var config = require('../lib/config');
var router = express.Router();
const https = require('https');

var request = require('request');

var db = require('../lib/database.js');

router.get('/games', function(req, res, next) {
  db.query("select * from riskGames;", function(results){
    res.send(results);
  });
});

router.get('/games/:gameId/cells', function(req, res, next) {
  var gameId = req.params.gameId;
  db.query("select * from riskCells where gameId=" + db.escape(gameId) + ";", function(results){
    res.send(results);
  });
});

router.get('/games/:gameId/links', function(req, res, next) {
  var gameId = req.params.gameId;
  db.query("select * from riskLinks where gameId=" + db.escape(gameId) + ";", function(results){
    res.send(results);
  });
});

router.post('/games/:gameId/cells', function(req, res, next) {
  var gameId = req.params.gameId;
  var body = req.body;
  db.query("update riskCells set owner=" + db.escape(body.owner) + ",  troops=" + db.escape(body.troops) + ",  description=" + db.escape(body.description) + ",  active=" + db.escape(body.active)
   + ",  revisionId=" + db.escape(body.revisionId + 1) + " where name=" + db.escape(body.name)
   + " and revisionId=" + db.escape(body.revisionId) + " and gameId=" + db.escape(gameId) + ";", function(results){

    console.log(results);
    if(results.affectedRows == 0){
      res.status(400).send("Cell Not Updated");
      return;
    }

    db.query("select * from riskCells where name=" + db.escape(req.body.name) + " and gameId=" + db.escape(gameId) + ";", function(results){
      res.send(results[0]);
    });
  });
});

router.post('/games/:gameId/links', function(req, res, next) {
  var gameId = req.params.gameId;
  var targetCell = req.body.target;
  var neighbors = req.body.neighbors;
  db.query("delete from riskLinks where gameId=" + db.escape(gameId) + " and (cell1=" + db.escape(targetCell) + " or cell2=" + db.escape(targetCell) + ");", function(results){

    console.log(results);
    if(!neighbors || neighbors.length == 0){
      res.send("ok");
      return;
    }
    var neighborStrings = neighbors.map(function(neighbor){ return "(" + db.escape(targetCell) + ", " + db.escape(neighbor) + ", " + db.escape(gameId) + ")"; });
    var valueString = neighborStrings.join(", ");
    console.log(valueString);

    db.query("insert into riskLinks (`cell1`, `cell2`, `gameId`) VALUES " + valueString + ";", function(results){
      console.log(results);
      res.send("ok");
    });
  });
});

module.exports = router;
