var action = {};

/////////////////////////////////////////////////////////////////////
// libraries
var async = require('async');

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'userEdit';
action.description = 'This Action can edit a given User';
action.inputs = {
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
};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    api.ahDashboard.users.editUser(data.params.username, data.params.email, data.params.password, data.params.firstName, data.params.lastName, function(err){
      data.connection.error = err;
      data.response.userUpdated = true;
      next();
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;