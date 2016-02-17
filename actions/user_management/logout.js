var action = {};

/////////////////////////////////////////////////////////////////////
// libraries

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'logout';
action.description = 'This Action loggs out the current user o';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
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
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;