var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getStatsKeys';
action.description = 'I will return all stats keys';
action.inputs = {
  'required' : [],
  'optional' : []
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
  api.stats.getAll(function(err, stats) {
    // extract the stats from the configured key
    var allStats = stats[api.config.stats.keys[0]];
    connection.response.statsKeys = allStats;
    next(connection, true);
  });

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
