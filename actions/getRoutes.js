var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getRoutes';
action.description = 'I will return all registered routes';
action.inputs = {
  'required' : [],
  'optional' : []
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
  connection.response.routes = api.routes.routes;
  next(connection, true);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
