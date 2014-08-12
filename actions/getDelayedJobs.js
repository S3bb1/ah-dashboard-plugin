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
  // Get all delyed jobs via ZRANGEBYSCORE
  api.redis.client.zrangebyscore('resque:delayed_queue_schedule', '-inf', '+inf', function(err, scheduled) {
    var delayedJobs = [];
    // Iterate through all scheduled timestamps
    async.each(scheduled, function( timestamp, callback) {

      // Request the delayed jobs list for current Timestamp
      api.redis.client.lrange('resque:delayed:'+timestamp, 0, -1, function(err, delayedJobsRedis) {
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
