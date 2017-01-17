exports.getDbUser = function(){
  var user = process.env.DB_USER;
  if(!user){
    user = process.argv[2];
  }
  return user;
}

exports.getDbPassword = function(){
  var pass = process.env.DB_PASSWORD;
  if(!pass){
    pass = process.argv[3];
  }
  return pass;
}
