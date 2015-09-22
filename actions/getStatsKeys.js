var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getStatsKeys';
action.description = 'I will return all stats keys';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
  	// get all keys from the tracked stats
    api.redis.client.hkeys("stats:keys", function(err, stats) {
      data.response.statsKeys = stats;
      next();
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
