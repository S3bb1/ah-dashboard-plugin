var os = require('os-utils');
var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getRAMusage';
action.description = 'I will return the current ram usage';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function (api, data, next) {
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    data.response.freemem = os.freemem();
    data.response.totalmem = os.totalmem();
    next();
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
