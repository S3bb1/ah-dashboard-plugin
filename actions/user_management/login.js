var action = {};

/////////////////////////////////////////////////////////////////////
// libraries

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'login';
action.description = 'This Action loggs in a given user';
action.inputs = {
  "username": {
    required: true
  }, 
  "password": {
    required: true
  }
};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
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
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;