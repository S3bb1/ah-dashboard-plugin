var action = {};

/////////////////////////////////////////////////////////////////////
// libraries

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'currentUser';
action.description = 'This Action returns the current logged in user';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
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
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;