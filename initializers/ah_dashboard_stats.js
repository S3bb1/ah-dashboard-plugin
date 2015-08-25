module.exports = {
  startPriority: 1001,
  start: function(api, next){
    api.ahDashboard.prevStats = {};
    api.ahDashboard.prevStats.timer = null;
    api.ahDashboard.prevStats.pendingIncrements = {};

    api.ahDashboard.prevStats.increment = function(key, count) {
      if (!count) {
        count = 1;
      }
      count = parseFloat(count);
      if (!api.ahDashboard.prevStats.pendingIncrements[key]) {
        api.ahDashboard.prevStats.pendingIncrements[key] = 0
      }
      api.ahDashboard.prevStats.pendingIncrements[key] = api.ahDashboard.prevStats.pendingIncrements[key] + count;
    }

    api.ahDashboard.prevStats.writeIncrements = function(next) {
      clearTimeout(api.ahDashboard.prevStats.timer);
      if (api.utils.hashLength(api.ahDashboard.prevStats.pendingIncrements) > 0 && api.config.stats.prevKeys.length > 0) {
        var started = 0;
        var pendingIncrements = api.utils.objClone(api.ahDashboard.prevStats.pendingIncrements);
        api.ahDashboard.prevStats.pendingIncrements = {};
        for ( var i in api.config.stats.prevKeys) {
          started++;
          var collection = api.config.stats.prevKeys[i];
          (function(collection) {
            var multi = api.redis.client.multi();
            for ( var key in pendingIncrements) {
              var value = pendingIncrements[key];
              multi.hincrby(collection, key, value);
            }
            multi.exec(function() {
              started--;
              if (started === 0) {
                api.ahDashboard.prevStats.timer = setTimeout(api.ahDashboard.prevStats.writeIncrements, api.config.stats.writeFrequency);
                if (typeof next === 'function') {
                  next()
                }
              }
            });
          })(collection);
        }
      } else {
        api.ahDashboard.prevStats.timer = setTimeout(api.ahDashboard.prevStats.writeIncrements, api.config.stats.writeFrequency);
        if (typeof next === 'function') {
          next()
        }
      }
    }

    api.ahDashboard.prevStats.get = function(key, collection, next) {
      if (!next && typeof collection === 'function') {
        next = collection;
        collection = null;
      }
      if (!collection) {
        collection = api.config.stats.prevKeys[0]
      }
      api.redis.client.hget(collection, key, function(err, value) {
        next(err, value);
      });
    }

    api.ahDashboard.prevStats.getAll = function(collections, next) {
      if (!next && typeof collections === 'function') {
        next = collections;
        collections = null;
      }
      if (!collections) {
        collections = api.config.stats.prevKeys;
      }

      var results = {};
      if (collections.length === 0) {
        next(null, results);
      } else {
        for ( var i in collections) {
          var collection = collections[i];
          (function(collection) {
            api.redis.client.hgetall(collection, function(err, data) {
              if (!data) {
                data = {}
              }
              results[collection] = data;
              if (api.utils.hashLength(results) === collections.length) {
                next(err, results);
              }
            });
          })(collection);
        }
      }
    }
    next();
  }
};