var action = {};

/////////////////////////////////////////////////////////////////////
// libraries
var async = require('async');

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getTasksStatistics';
action.description = 'I will return all statistics for runned tasks';
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
      var processedJobs = {};
      api.resque.scheduler.connection.redis.get('resque:stat:processed', function(err, processedOverallJob) {
        processedJobs.All = processedOverallJob;
        data.response.processedJobs = processedJobs;
      });
      // Iterate through each worker strint
      async.each(workers, function( worker, callback) {
        // get the current stats for the Worker
        var splittedWorker = worker.split(':');
        api.resque.scheduler.connection.redis.get('resque:stat:processed:' + splittedWorker[0] + ':' + splittedWorker[1], function(err, processedJob) {
          processedJobs[splittedWorker[0] + ':' + splittedWorker[1]] = processedJob;
          callback();
        });
      }, function(err){
        // At the end return all running jobs for all workers
        data.response.processedJobs = processedJobs;
        next();
      });
    });
  }, next);
};
/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
