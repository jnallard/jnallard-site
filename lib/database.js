var cps = require('cps');

var config = require('./config.js');

var db = require('node-mysql');
var DB = db.DB;
var BaseRow = db.Row;
var BaseTable = db.Table;

var box = new DB({
    host     : 'the-allards.com',
    user     : config.getDbUser(),
    password : config.getDbPassword(),
    database : 'jnallard'
});

var conn = null;

var connectedCb = function(){
  console.log("Connected to db");
}

box.connect(function(new_conn, connectedCb) {
  conn = new_conn;
  connectedCb();
}, connectedCb);

exports.getUsers = function(cb){
  cps.seq([
    function(_, cb) {
        conn.query('select * from users', cb);
    },
    function(res, cb) {
        console.log(res);
        cb(res);
    }
  ], cb);
}
