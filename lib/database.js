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
  debug    :  true,
  wait_timeout : 28800,
  connect_timeout :10
});

exports.getUsers = function(cb){
  console.log("getUsers");

  pool.query('select * from users', function (error, results, fields) {
    console.log(error);
    if (error) throw error;
    console.log('The solution is: ', results);
    cb(results);
  });
}
