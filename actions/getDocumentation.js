var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getDocumentation';
action.description = 'I will return the documentation of the actions';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    data.response.documentation = api.documentation.documentation;
    next();
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
