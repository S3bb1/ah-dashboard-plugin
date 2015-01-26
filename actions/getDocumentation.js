var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getDocumentation';
action.description = 'I will return the documentation of the actions';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
  connection.response.documentation = api.documentation.documentation;
  next(connection, true);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
