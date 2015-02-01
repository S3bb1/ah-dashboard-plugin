var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'updateRedisZSetItem';
action.description = 'I will add or update a Item out of a Redis ZSet';
action.inputs = {
  score: {
    required: true
  },
  keyPath: {
    required: true
  },
  value: {
    required: true
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
    api.redis.client.zadd(connection.params.keyPath, connection.params.score, connection.params.value, function(err, res){
      var startIdx = parseInt(connection.params.index, 10);
      if (typeof(startIdx) == 'undefined' || isNaN(startIdx) || startIdx < 0) {
        startIdx = 0;
      }
      var endIdx = startIdx + 19;
      api.redis.client.zrange(connection.params.keyPath, startIdx, endIdx, 'WITHSCORES', function (err, items) {
        if (err) {
          api.log('updateRedisZSetItem: ' + err, 'error');
        }

        items = mapZSetItems(items);

        var i = startIdx;
        items.forEach(function (item) {
          item.number = i++;
        });
        api.redis.client.zcount(connection.params.keyPath, "-inf", "+inf", function (err, length) {
          var details = {
            key: connection.params.keyPath,
            type: 'zset',
            items: items,
            beginning: startIdx <= 0,
            end: endIdx >= length - 1,
            length: length
          };
          connection.response.details = details;
          next(connection, true);
        });
      });
    });
  }, next);
};

function mapZSetItems (items) {
  var results = [];
  for (var i = 0; i < items.length; i += 2) {
    results.push({
      score: items[i + 1],
      value: items[i]
    });
  }
  return results;
}

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
