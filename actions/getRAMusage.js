var os = require('os-utils');
var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getRAMusage';
action.description = 'I will return the current ram usage';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function (api, connection, next) {
  connection.response.freemem = os.freemem();
  connection.response.totalmem = os.totalmem();
  next(connection, true);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
