var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'removeRedisHashItem';
action.description = 'I will remove a Item out of a Redis Hash';
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
    api.redis.client.hdel(data.params.keyPath, data.params.item, function(err, res){
      api.redis.client.hgetall(data.params.keyPath, function (err, fieldsAndValues) {
        if (err) {
          api.log('removeRedisHashItem: ' + err, 'error');
        } else {
          var details = {
            key: data.params.keyPath,
            type: 'hash',
            data: fieldsAndValues
          };
          data.response.details = details;
        }
        next();
      });
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
