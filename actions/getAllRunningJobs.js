var async = require('async');
var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getAllRunningJobs';
action.description = 'I will return all successful jobs';
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
    // Get all workers
  api.redis.client.smembers('resque:workers', function(err, workers) {
    var runningJobs = [];
    // Iterate through each worker strint
    async.each(workers, function( worker, callback) {
      // get the current running job for the Worker
      api.redis.client.get('resque:worker:'+worker, function(err, runningJob) {
        if(runningJob){
          runningJobs.push(JSON.parse(runningJob));
        }
        callback();
      });
    }, function(err){
      // At the end return all running jobs for all workers
      connection.response.runningJobs = runningJobs;
      next(connection, true);
    });
  });

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
