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
action.run = function(api, connection, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(connection, function(session){
    api.redis.client.hdel(connection.params.keyPath, connection.params.item, function(err, res){
      api.redis.client.hgetall(connection.params.keyPath, function (err, fieldsAndValues) {
        if (err) {
          api.log('removeRedisHashItem: ' + err, 'error');
        } else {
          var details = {
            key: connection.params.keyPath,
            type: 'hash',
            data: fieldsAndValues
          };
          connection.response.details = details;
        }
        next(connection, true);
      });
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
