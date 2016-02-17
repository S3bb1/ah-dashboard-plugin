var action = {};

/////////////////////////////////////////////////////////////////////
// libraries

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getUsers';
action.description = 'This Action returns all current users';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
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
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;