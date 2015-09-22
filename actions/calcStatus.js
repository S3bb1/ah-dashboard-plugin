var action = {};
var _ = require('underscore');
var async = require('async');

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getStats';
action.description = 'I will return the timeseries for all or specific keys';
action.inputs = {
  timerange: {
    required: true
  },
  allKeys: {
    required: false
  },
  specificKeys: {
    required: false
  }
};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    data.response.id = api.id;
    
    data.response.timeseries = {};
    var now = new Date().getTime();
    api.redis.client.hkeys("stats:keys", function(err, stats) {
      console.dir(stats);
      var timechunks = 5;
      var timeInterval = '1minute';
      switch(data.params.timerange){
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
      // iterate through all available statistics and get their corresponding timeseries value
      async.each(stats, function(stat, callback) {
        api.ahDashboard.timesSeries.getHits(stat, timeInterval, timechunks, function(err, res){
          for(var a in res){
            res[a].push(new Date((res[a][0]*1000)));
          }
          data.response.timeseries[stat] = res;
          callback();
        });
      }, function(err){
        // At the end return all calculated stats to the frontend
        api.log('All stats have been processed successfully', 'info');
        next();
      });
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
