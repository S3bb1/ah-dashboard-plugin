var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getAllRedisKeys';
action.description = 'I will return all redis keys';
action.inputs = {
  'prefix' : {
    required: false
  }
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(connection, function(session){
    var separator = ':';
    var query;
    var prefix = connection.params.prefix;
    var async = require('async');
    if(prefix){
      query = prefix + separator + '*';
    } else {
      query = '*';
    }
    api.redis.client.keys(query, function (err, keys) {
      if (err) {
        console.error('getKeys', err);
      } else {
        var lookup = {};
        var reducedKeys = [];
        keys.forEach(function (key) {
          var fullKey = key;
          if (prefix) {
            key = key.substr((prefix + separator).length);
          }
          var parts = key.split(separator);
          var firstPrefix = parts[0];
          if (lookup.hasOwnProperty(firstPrefix)) {
            lookup[firstPrefix].count++;
          } else {
            lookup[firstPrefix] = {
              attr: {},
              key: firstPrefix,
              count: parts.length === 1 ? 0 : 1
            };
            lookup[firstPrefix].fullKey = fullKey;
            if (parts.length === 1) {
              lookup[firstPrefix].leaf = true;
            }
            reducedKeys.push(lookup[firstPrefix]);
          }
        });
        reducedKeys.forEach(function (data) {
          if (data.count === 0) {
            data.title = data.key;
          } else {
            data.title = data.key + ":* (" + data.count + ")";
            data.lazy = true;
            data.folder = true;
          }
        });

        async.forEachLimit(reducedKeys, 10, function (keyData, callback) {
          if (keyData.leaf) {
            api.redis.client.type(keyData.fullKey, function (err, type) {
              if (err) {
                return callback(err);
              }
              keyData.attr.rel = type;
              keyData.icon = type+".png";
              var sizeCallback = function (err, count) {
                if (err) {
                  return callback(err);
                } else {
                  keyData.data += " (" + count + ")";
                  callback();
                }
              };
              if (type == 'list') {
                api.redis.client.llen(keyData.fullKey, sizeCallback);
              } else if (type == 'set') {
                api.redis.client.scard(keyData.fullKey, sizeCallback);
              } else if (type == 'zset') {
                api.redis.client.zcard(keyData.fullKey, sizeCallback);
              } else {
                callback();
              }
            });
          } else {
            callback();
          }
        }, function (err) {
          if (err) {
            console.error('getKeys', err);
            return next(err);
          }
          reducedKeys = reducedKeys.sort(function (a, b) {
            return a.data > b.data ? 1 : -1;
          });
          
          connection.response.redisKeys = reducedKeys;
          next(connection, true);
        });
      }
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
