var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'removeRedisListItem';
action.description = 'I will remove a Item out of a Redis List';
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
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    api.redis.client.lrem(data.params.keyPath, 0, data.params.item, function(err, res){
      var startIdx = parseInt(data.params.index, 10);
      if (typeof(startIdx) == 'undefined' || isNaN(startIdx) || startIdx < 0) {
        startIdx = 0;
      }
      var endIdx = startIdx + 19;
      api.redis.client.lrange(data.params.keyPath, startIdx, endIdx, function (err, items) {
        if (err) {
          api.log('removeRedisListItem: ' + err, 'error');
        }

        var i = startIdx;
        items = items.map(function (item) {
          return {
            number: i++,
            value: item
          };
        });
        api.redis.client.llen(data.params.keyPath, function (err, length) {
          if (err) {
            api.log('removeRedisListItem: ' + err, 'error');
          }
          var details = {
            key: data.params.keyPath,
            type: 'list',
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

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
