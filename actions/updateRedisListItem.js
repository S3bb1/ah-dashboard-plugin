var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'updateRedisListItem';
action.description = 'I will update a Redis List Item';
action.inputs = {
  number: {
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
  api.session.checkAuth(connection, function(session){
    api.redis.client.lset(connection.params.keyPath, connection.params.number, connection.params.value, function(err, res){
      var startIdx = parseInt(connection.params.index, 10);
      if (typeof(startIdx) == 'undefined' || isNaN(startIdx) || startIdx < 0) {
        startIdx = 0;
      }
      var endIdx = startIdx + 19;
      api.redis.client.lrange(connection.params.keyPath, startIdx, endIdx, function (err, items) {
        if (err) {
          api.log('updateRedisListItem: ' + err, 'error');
        }

        var i = startIdx;
        items = items.map(function (item) {
          return {
            number: i++,
            value: item
          }
        });
        api.redis.client.llen(connection.params.keyPath, function (err, length) {
          if (err) {
            api.log('updateRedisListItem: ' + err, 'error');
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
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
