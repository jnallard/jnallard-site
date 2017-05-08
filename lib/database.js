var config = require('./config.js');

var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit : 100,
  waitForConnections : true,
  queueLimit :0,
  host     : 'the-allards.com',
  user     : config.getDbUser(),
  password : config.getDbPassword(),
  database : 'jnallard',
  debug    :  false,
  wait_timeout : 28800,
  connect_timeout :10
});

exports.getUsers = function(cb){

  pool.query('select name, id from users', function (error, results, fields) {
    if (error) throw error;
    cb(results);
  });
}

exports.query = function(query, cb){

  pool.query(query, function (error, results, fields) {
    if (error) throw error;
    cb(results);
  });
}

exports.escape = function(text){
  return mysql.escape(text);
}
