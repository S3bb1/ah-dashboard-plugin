var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'updateRedisHashItem';
action.description = 'I will update a Item of a Redis Hash';
action.inputs = {
  item: {
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
    api.redis.client.hset(data.params.keyPath, data.params.item, data.params.value, function(err, res){
      api.redis.client.hgetall(data.params.keyPath, function (err, fieldsAndValues) {
        if (err) {
          api.log('updateRedisHashItem: ' + err, 'error');
        }
        var details = {
          key: data.params.keyPath,
          type: 'hash',
          data: fieldsAndValues
        };
        data.response.details = details;
        next();
      });
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
