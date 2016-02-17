var action = {};

/////////////////////////////////////////////////////////////////////
// libraries


/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'userAdd';
action.description = 'This Action adds Users to Redis';
action.inputs = {
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
};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
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
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;