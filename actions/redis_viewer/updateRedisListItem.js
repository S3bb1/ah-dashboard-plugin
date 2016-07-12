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
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    api.redis.clients.client.lset(data.params.keyPath, data.params.number, data.params.value, function(err, res){
      var startIdx = parseInt(data.params.index, 10);
      if (typeof(startIdx) == 'undefined' || isNaN(startIdx) || startIdx < 0) {
        startIdx = 0;
      }
      var endIdx = startIdx + 19;
      api.redis.clients.client.lrange(data.params.keyPath, startIdx, endIdx, function (err, items) {
        if (err) {
          api.log('updateRedisListItem: ' + err, 'error');
        }

        var i = startIdx;
        items = items.map(function (item) {
          return {
            number: i++,
            value: item
          };
        });
        api.redis.clients.client.llen(data.params.keyPath, function (err, length) {
          if (err) {
            api.log('updateRedisListItem: ' + err, 'error');
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
