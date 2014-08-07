var os  = require('os-utils');
var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getCPUusage';
action.description = 'I will return the current cpu usage';
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
  os.cpuUsage(function(usage){
    connection.response.cpuusage = usage;
    next(connection, true);
  });
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
