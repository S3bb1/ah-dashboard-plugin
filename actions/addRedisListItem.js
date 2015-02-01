var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'addRedisListItem';
action.description = 'I will add a Item into a Redis List';
action.inputs = {
  value: {
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
action.run = function(api, connection, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(connection, function(session){
    api.redis.client.lpush(connection.params.keyPath, connection.params.value, function(err, res){
      var startIdx = parseInt(connection.params.index, 10);
      if (typeof(startIdx) == 'undefined' || isNaN(startIdx) || startIdx < 0) {
        startIdx = 0;
      }
      var endIdx = startIdx + 19;
      api.redis.client.lrange(connection.params.keyPath, startIdx, endIdx, function (err, items) {
        if (err) {
          api.log('addRedisListItem: ' + err, 'error');
        }

        var i = startIdx;
        items = items.map(function (item) {
          return {
            number: i++,
            value: item
          };
        });
        api.redis.client.llen(connection.params.keyPath, function (err, length) {
          if (err) {
            api.log('addRedisListItem: ' + err, 'error');
          }
          var details = {
            key: connection.params.keyPath,
            type: 'list',
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
  }, next );
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
