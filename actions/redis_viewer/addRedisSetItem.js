var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'addRedisSetItem';
action.description = 'I will add a Item into a Redis Set';
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
    api.redis.client.sadd(data.params.keyPath, data.params.item, function(err, res){
      api.redis.client.smembers(data.params.keyPath, function (err, members) {
        if (err) {
          api.log('addRedisSetItem: ' + err, 'error');
        }

        var details = {
          key: data.params.keyPath,
          type: 'set',
          members: members
        };
        data.response.details = details;
        next();
      });
    });
  }, next );
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
