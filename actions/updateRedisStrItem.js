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
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    api.redis.client.set(data.params.keyPath, data.params.value, function(err, res){
      api.redis.client.get(data.params.keyPath, function (err, val) {
        if (err) {
          api.log('updateRedisStrItem: ' + err, 'error');
        }

        var details = {
          key: data.params.keyPath,
          type: 'string',
          value: val
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
