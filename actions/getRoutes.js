var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getRoutes';
action.description = 'I will return all registered routes';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    data.response.routes = api.routes.routes;
    next();
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
