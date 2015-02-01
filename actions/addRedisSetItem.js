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
action.run = function(api, connection, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(connection, function(session){
    api.redis.client.sadd(connection.params.keyPath, connection.params.item, function(err, res){
      api.redis.client.smembers(connection.params.keyPath, function (err, members) {
        if (err) {
          api.log('addRedisSetItem: ' + err, 'error');
        }

        var details = {
          key: connection.params.keyPath,
          type: 'set',
          members: members
        };
        connection.response.details = details;
        next(connection, true);
      });
    });
  }, next );
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
