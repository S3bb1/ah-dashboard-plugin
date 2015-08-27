var calcStatus = {
  name:          'calcStatus',
  description:   'I calculate statistics',
  queue:         'default',
  plugins:       [],
  pluginOptions: [],
  frequency:     5000,
  run: function(api, params, next){
    if(params == null){ params = {} }
    // getting all stats
    api.stats.getAll(function(err, stats){
      // extract the stats from the configured key
      var allStats = stats[api.config.stats.keys[0]];

      api.ahDashboard.prevStats.getAll(function(err, prevStats) {
        var allPrevStats = prevStats[api.config.stats.prevKeys[0]];
        // now calculate the differences between the old stats value and the new Stats value
        for(var a in allStats){
          // check if the key is present
          var prevInt;
          if (allPrevStats && allPrevStats[a]) {
            prevInt = parseInt(allPrevStats[a]);
          } else {
            prevInt = 0;
          }
          var nowInt = parseInt(allStats[a]);
          var difference = nowInt-prevInt;
          // only add the difference if its greater than 0
          if(difference > 0){
            // add the difference to the timeseries
            api.ahDashboard.timesSeries.recordHit(a, undefined, difference).exec();

            // So go ahead and increment the previous statistic as well.
            api.ahDashboard.prevStats.increment(a, difference);
          }
        }

        next();
      });
    });

  }
};

exports.calcStatus = calcStatus;
