var crypto = require('crypto');
var redisPrefix = "__users-";
var caluculatePasswordHash = function(password, salt){
  return crypto.createHash('sha256').update(salt + password).digest("hex");
}
var cacheKey = function(connection){
  return redisPrefix + connection.params.email.replace("@","_").replace(".","_")
}

exports.userAdd = {
  name: "userAdd",
  description: "userAdd",
  inputs: {
    "email": {
      required: true
    }, 
    "password": {
      required: true
    }
  },
  blockedConnectionTypes: [],
  outputExample: {},
  run: function(api, connection, next){
    if(connection.params.password.length < 6){
      connection.error = "password must be longer than 6 chars";
      next(connection, true)
    }else{
      var passwordSalt = api.utils.randomString(64);
      var passwordHash = caluculatePasswordHash(connection.params.password, passwordSalt);
      var user = {
        email: connection.params.email,
        passwordSalt: passwordSalt,
        passwordHash: passwordHash,
      };
      console.log(cacheKey(connection))
      api.cache.save(cacheKey(connection), user, function(error){
        connection.error = error;
        connection.response.userCreated = true;
        next(connection, true);
      });
    }
  }
};

exports.currentUser = {
  name: "currentUser",
  description: "currentUser",
  inputs: {},
  blockedConnectionTypes: [],
  outputExample: {},
  run: function(api, connection, next){
    connection.response.auth = false;
    api.session.checkAuth(connection, function(session){
      console.dir(session);
      api.cache.load(session.cacheKey, function(err, user){
        connection.response.email = user.email;
        connection.response.fingerprint = connection.fingerprint;
        connection.response.auth = true;
        next(connection, true);
      });
    }, function(err){
      connection.error = err;
      next(connection, true);
    });
  }
}

exports.logIn = {
  name: "logIn",
  description: "logIn",
  inputs: {
    "email": {
      required: true
    }, 
    "password": {
      required: true
    }
  },
  blockedConnectionTypes: [],
  outputExample: {},
  run: function(api, connection, next){
    connection.response.auth = false;
    var userCacheKey = cacheKey(connection);
    api.cache.load(userCacheKey, function(err, user){
      if(err){
        connection.error = err;
        next(connection, true);
      }else if(user == null){
        connection.error = "User not found";
        next(connection, true);
      }else{
        var passwordHash = caluculatePasswordHash(connection.params.password, user.passwordSalt);
        if(passwordHash !== user.passwordHash){
          connection.error = "incorrect password";
          next(connection, true);
        }else{
          api.session.generateAtLogin(connection, userCacheKey, function(){
            connection.response.email = user.email;
            connection.response.fingerprint = connection.fingerprint;
            connection.response.auth = true;
            next(connection, true);
          });
        }
      }
    });
  }
};