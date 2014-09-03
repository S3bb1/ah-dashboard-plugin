var async = require('async');
var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getTasksStatistics';
action.description = 'I will return all statistics for runned tasks';
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
  // we cant process any tasks if no scheduler runs... abort action with error
  if(!api.resque.scheduler){
    connection.response.errorMessage = "No Scheduler running!";
    next(connection, true);
    return;
  }  
  // Get all workers
  api.resque.scheduler.connection.redis.smembers('resque:workers', function(err, workers) {
    var processedJobs = {};
    api.resque.scheduler.connection.redis.get('resque:stat:processed', function(err, processedOverallJob) {
      processedJobs["All"] = processedOverallJob;
      connection.response.processedJobs = processedJobs;
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
      connection.response.processedJobs = processedJobs;
      next(connection, true);
    });
  });

};
/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
