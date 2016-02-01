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
    },
    "firstName": {
      required: true
    },
    "lastName": {
      required: true
    },
    "username": {
      required: true
    }
  },
  blockedConnectionTypes: [],
  outputExample: {},
  run: function(api, data, next){
    // Check authentication for current Request
    api.ahDashboard.session.checkAuth(data, function(session){
      if(data.params.password.length < 6){
        data.connection.error = "password must be longer than 6 chars";
        next();
      }else{
        api.ahDashboard.users.addUser(data.params.username, data.params.email, data.params.password, data.params.firstName, data.params.lastName, function(err){
          data.connection.error = err;
          data.response.userCreated = true;
          next();
        });
      }
    }, next);
  }
};

exports.userEdit = {
  name: "userEdit",
  description: "userEdit",
  inputs: {
    "password": {
      required: true
    },
    "email": {
      required: false
    },
    "firstName": {
      required: false
    },
    "lastName": {
      required: false
    },
    "username": {
      required: true
    }
  },
  blockedConnectionTypes: [],
  outputExample: {},
  run: function(api, data, next){
    // Check authentication for current Request
    api.ahDashboard.session.checkAuth(data, function(session){
      api.ahDashboard.users.editUser(data.params.username, data.params.email, data.params.password, data.params.firstName, data.params.lastName, function(err){
        data.connection.error = err;
        data.response.userUpdated = true;
        next();
      });
    }, next);
  }
};

exports.userDelete = {
  name: "userDelete",
  description: "userDelete",
  inputs: {
    "username": {
      required: true
    }
  },
  blockedConnectionTypes: [],
  outputExample: {},
  run: function(api, data, next){
    // Check authentication for current Request
    api.ahDashboard.session.checkAuth(data, function(session){
      api.ahDashboard.users.deleteUser(data.params.username, function(err){
        data.connection.error = err;
        data.response.userdeleted = true;
        next();
      });
    }, next);
  }
};


exports.currentUser = {
  name: "currentUser",
  description: "currentUser",
  inputs: {},
  blockedConnectionTypes: [],
  outputExample: {},
  run: function(api, data, next){
    data.response.auth = false;
    api.ahDashboard.session.checkAuth(data, function(session){
      api.cache.load(session.cacheKey, function(err, user){
        data.response.email = user.email;
        data.response.firstName = user.firstName;
        data.response.lastName = user.lastName;
        data.response.username = user.username;
        data.response.fingerprint = data.connection.fingerprint;
        data.response.auth = true;
        next();
      });
    }, function(err){
      next();
    });
  }
};

exports.login = {
  name: "login",
  description: "login",
  inputs: {
    "username": {
      required: true
    }, 
    "password": {
      required: true
    }
  },
  blockedConnectionTypes: [],
  outputExample: {},
  run: function(api, data, next){
    data.response.auth = false;
    api.ahDashboard.users.login(data, function(err, user){
      if(err){
        data.connection.error = err;
        next();
      } else {
        data.response.email = user.email;
        data.response.firstName = user.firstName;
        data.response.lastName = user.lastName;
        data.response.accountname = user.accountname;
        data.response.fingerprint = data.connection.fingerprint;
        data.response.auth = true;
        next();
      }
    });
  }
};

exports.getUsers = {
  name: "getUsers",
  description: "getUsers",
  inputs: {},
  blockedConnectionTypes: [],
  outputExample: {},
  run: function(api, data, next){
    api.ahDashboard.session.checkAuth(data, function(session){
      api.ahDashboard.users.getUsers(function(err, users){
        if(err){
          data.connection.error = err;
          next();
        } else {
          data.response.users = users;
          next();
        }
      });
    }, next);
  }
};

exports.logout = {
  name: "logout",
  description: "logout",
  inputs: {},
  blockedConnectionTypes: [],
  outputExample: {},
  run: function(api, data, next){
    data.response.auth = false;
    api.ahDashboard.session.delete(data, function(err){
      if(err){
        data.connection.error = err;
        next();
      } else {
        data.response.logout = true;
        next();
      }
    });
  }
};