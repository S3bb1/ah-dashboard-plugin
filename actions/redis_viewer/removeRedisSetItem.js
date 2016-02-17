var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'removeRedisSetItem';
action.description = 'I will remove a Item out of a Redis Set';
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
    api.redis.client.srem(data.params.keyPath, data.params.item, function(err, res){
      api.redis.client.smembers(data.params.keyPath, function (err, members) {
        if (err) {
          api.log('removeRedisHashItem: ' + err, 'error');
          data.response.error = err;
        } else {
          var details = {
            key: data.params.keyPath,
            type: 'set',
            members: members
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
