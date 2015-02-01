var crypto = require('crypto');


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
    // Check authentication for current Request
    api.ahDashboard.session.checkAuth(connection, function(session){
      if(connection.params.password.length < 6){
        connection.error = "password must be longer than 6 chars";
        next(connection, true);
      }else{
        api.ahDashboard.users.addUser(connection.params.email, connection.params.password, function(err){
          connection.error = error;
          connection.response.userCreated = true;
          next(connection, true);
        });
      }
    }, next);
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
    api.ahDashboard.session.checkAuth(connection, function(session){
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
    api.ahDashboard.users.login(connection, function(err, user){
      if(err){
        connection.error = err;
        next(connection, true);
      } else {
        connection.response.email = user.email;
        connection.response.fingerprint = connection.fingerprint;
        connection.response.auth = true;
        next(connection, true);
      }
    });
  }
};