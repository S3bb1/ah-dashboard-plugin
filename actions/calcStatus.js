var action = {};
var _ = require('underscore');

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getStats';
action.description = 'I will return the timeseries for all or specific keys';
action.inputs = {
  'required' : ['key', 'timerange'],
  'optional' : ['allKeys', 'specificKeys']
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
  connection.response.id = api.id;
  connection.response.timeseries = {};
  var now = new Date().getTime();
  api.stats.getAll(function(err, stats) {
    // extract the stats from the configured key
    var allStats = stats[api.config.stats.keys[0]];
    var allStatsCount = _.size(allStats);
    var curCount = 0;
    var timechunks = 5;
    var timeInterval = '1minute';
    switch(connection.params.timerange){
      case 'minute':
        timechunks = 60;
        timeInterval = '1second';
        break;
      case 'hour' :
      timechunks = 60;
      timeInterval = '1minute';
      break;
      case 'hour5' :
        timechunks = 12;
        timeInterval = '5minutes';
        break;
      case 'hour10' :
        timechunks = 6;
        timeInterval = '10minutes';
        break;
      case 'day' :
        timechunks = 24;
        timeInterval = '1hour';
        break;
      default:

    }
    // now calculate the differences between the old stats value and the new Stats value
    for (var a in allStats) {
      api.ahDashboard.timesSeries.getHits(a, timeInterval, timechunks, function(err, key, data){
        for(var a in data){
          data[a].push(new Date((data[a][0]*1000)));
        }
        connection.response.timeseries[key] = data;
        curCount++;
        if(curCount == allStatsCount){
          next(connection, true);
        }

      });
    }
  });

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
