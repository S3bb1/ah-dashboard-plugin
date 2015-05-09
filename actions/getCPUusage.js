var os  = require('os-utils');
var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getCPUusage';
action.description = 'I will return the current cpu usage';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    os.cpuUsage(function(usage){
      data.response.cpuusage = usage;
      next();
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
