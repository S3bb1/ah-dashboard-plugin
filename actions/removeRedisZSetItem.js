var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'removeRedisZSetItem';
action.description = 'I will remove a Item out of a Redis ZSet';
action.inputs = {
  item: {
    required: true
  },
  keyPath: {
    required: true
  }
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
  api.redis.client.zrem(connection.params.keyPath, connection.params.item, function(err, res){
    var startIdx = parseInt(connection.params.index, 10);
    if (typeof(startIdx) == 'undefined' || isNaN(startIdx) || startIdx < 0) {
      startIdx = 0;
    }
    var endIdx = startIdx + 19;
    api.redis.client.zrange(connection.params.keyPath, startIdx, endIdx, 'WITHSCORES', function (err, items) {
      if (err) {
        api.log('removeRedisZSetItem: ' + err, 'error');
      }

      items = mapZSetItems(items);

      var i = startIdx;
      items.forEach(function (item) {
        item.number = i++;
      });
      api.redis.client.zcount(connection.params.keyPath, "-inf", "+inf", function (err, length) {
        if (err) {
          api.log('removeRedisZSetItem: ' + err, 'error');
        }
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
