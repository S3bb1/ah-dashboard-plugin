var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'updateRedisStrItem';
action.description = 'I will update a Redis String';
action.inputs = {
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
  api.ahDashboard.session.checkAuth(connection, function(session){
    api.redis.client.set(connection.params.keyPath, connection.params.value, function(err, res){
      api.redis.client.get(connection.params.keyPath, function (err, val) {
        if (err) {
          api.log('updateRedisStrItem: ' + err, 'error');
        }

        var details = {
          key: connection.params.keyPath,
          type: 'string',
          value: val
        };
        
        connection.response.details = details;
        next(connection, true);
      });
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
