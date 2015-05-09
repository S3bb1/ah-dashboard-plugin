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
    api.stats.getAll(function(err, stats) {
      // extract the stats from the configured key
      var allStats = stats[api.config.stats.keys[0]];
      data.response.statsKeys = allStats;
      next();
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
