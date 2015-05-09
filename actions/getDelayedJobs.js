var async = require('async');
var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getDelayedJobs';
action.description = 'I will return all delayed jobs';
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
          api.log('All jobs have been processed successfully', 'info');
          data.response.delayedJobs = delayedJobs;
          next();
      });
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
