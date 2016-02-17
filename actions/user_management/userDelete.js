var action = {};

/////////////////////////////////////////////////////////////////////
// libraries

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'userDelete';
action.description = 'This Action deletes Users from Redis';
action.inputs = {
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
    api.ahDashboard.users.deleteUser(data.params.username, function(err){
      data.connection.error = err;
      data.response.userdeleted = true;
      next();
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;