var action = {};

/////////////////////////////////////////////////////////////////////
// libraries
var async = require('async');

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getAllRunningJobs';
action.description = 'I will return all successful jobs';
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
    // Get all workers
    api.resque.scheduler.connection.redis.smembers('resque:workers', function(err, workers) {
      var runningJobs = [];
      // Iterate through each worker strint
      async.each(workers, function( worker, callback) {
        // get the current running job for the Worker
        api.resque.scheduler.connection.redis.get('resque:worker:'+worker, function(err, runningJob) {
          if(runningJob){
            var runningJobJson = JSON.parse(runningJob);
            runningJobJson.run_at = new Date(Date.parse(runningJobJson.run_at)).getTime();
            runningJobJson.worker = worker;
            runningJobs.push(runningJobJson);
          }
          callback();
        });
      }, function(err){
        // At the end return all running jobs for all workers
        data.response.runningJobs = runningJobs;
        next();
      });
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
