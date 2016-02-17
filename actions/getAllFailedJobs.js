var action = {};

/////////////////////////////////////////////////////////////////////
// libraries
var async = require('async');

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getAllFailedJobs';
action.description = 'I will return all failed jobs';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function (api, data, next) {
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    // we cant process any tasks if no scheduler runs... abort action with error
    if(!api.resque.scheduler){
      data.response.errorMessage = "No Scheduler running!";
      next();
      return;
    }
    // Get all delyed jobs via ZRANGEBYSCORE
    api.resque.scheduler.connection.redis.lrange('resque:failed', 0, -1, function(err, failed) {
      var failedJobs = [];
      for(var fail in failed){
        failedJobs.push(failed[fail]);
      }
      data.response.failedJobs = failedJobs;
      next();
    });
  }, next);

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
