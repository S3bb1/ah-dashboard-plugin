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
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    api.redis.clients.client.zadd(data.params.keyPath, data.params.score, data.params.value, function(err, res){
      var startIdx = parseInt(data.params.index, 10);
      if (typeof(startIdx) == 'undefined' || isNaN(startIdx) || startIdx < 0) {
        startIdx = 0;
      }
      var endIdx = startIdx + 19;
      api.redis.clients.client.zrange(data.params.keyPath, startIdx, endIdx, 'WITHSCORES', function (err, items) {
        if (err) {
          api.log('updateRedisZSetItem: ' + err, 'error');
        }

        items = mapZSetItems(items);

        var i = startIdx;
        items.forEach(function (item) {
          item.number = i++;
        });
        api.redis.clients.client.zcount(data.params.keyPath, "-inf", "+inf", function (err, length) {
          var details = {
            key: data.params.keyPath,
            type: 'zset',
            items: items,
            beginning: startIdx <= 0,
            end: endIdx >= length - 1,
            length: length
          };
          data.response.details = details;
          next();
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
