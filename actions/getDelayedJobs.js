var async = require('async');
var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getDelayedJobs';
action.description = 'I will return all delayed jobs';
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
  // Get all delyed jobs via ZRANGEBYSCORE
  api.resque.scheduler.connection.redis.zrangebyscore('resque:delayed_queue_schedule', '-inf', '+inf', function(err, scheduled) {
    var delayedJobs = [];
    // Iterate through all scheduled timestamps
    async.each(scheduled, function( timestamp, callback) {

      // Request the delayed jobs list for current Timestamp
      api.resque.scheduler.connection.redis.lrange('resque:delayed:'+timestamp, 0, -1, function(err, delayedJobsRedis) {
        // parse every delayed job into the response array
        for(var a in delayedJobsRedis){
          var delayedJob = delayedJobsRedis[a];
          if(delayedJob){
            var json = JSON.parse(delayedJob);
            json.delayedAt = timestamp;
            delayedJobs.push(json);
          }
        }
        callback();
      });
    }, function(err){
        // At the end return all delayed Jobs to the frontend
        console.log('All jobs have been processed successfully');
        connection.response.delayedJobs = delayedJobs;
        next(connection, true);
    });
  });

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
