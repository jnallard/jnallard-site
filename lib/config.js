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

exports.getAuth0ClientSecret = function(){
  var secret = process.env.AUTH_CLIENT_SECRET;
  if(!secret){
    secret = process.argv[4];
  }
  return secret;
}
