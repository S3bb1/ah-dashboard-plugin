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
action.run = function(api, connection, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(connection, function(session){
    connection.response.routes = api.routes.routes;
    next(connection, true);
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
