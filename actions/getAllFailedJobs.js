var async = require('async');
var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getAllFailedJobs';
action.description = 'I will return all failed jobs';
action.inputs = {
  'required': [],
  'optional': []
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function (api, connection, next) {
  // Get all delyed jobs via ZRANGEBYSCORE
  api.resque.scheduler.connection.redis.lrange('resque:failed', 0, -1, function(err, failed) {
    var failedJobs = [];
    for(var fail in failed){
      failedJobs.push(JSON.parse(failed[fail]))
    }
    connection.response.failedJobs = failedJobs;
    next(connection, true);
  });

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
