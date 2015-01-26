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
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
  api.redis.client.srem(connection.params.keyPath, connection.params.item, function(err, res){
    console.dir(err);
    console.dir(res);
    api.redis.client.smembers(connection.params.keyPath, function (err, members) {
      if (err) {
        api.log('removeRedisHashItem: ' + err, 'error');
        connection.response.error = err;
      } else {
        var details = {
          key: connection.params.keyPath,
          type: 'set',
          members: members
        };
        connection.response.details = details;
      }
      next(connection, true);
    });
  });

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
