var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'addRedisSetItem';
action.description = 'I will remove a Item out of a Redis Set';
action.inputs = {
  'required' : ['item', 'keyPath'],
  'optional' : []
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
  api.redis.client.sadd(connection.params.keyPath, connection.params.item, function(err, res){
    api.redis.client.smembers(connection.params.keyPath, function (err, members) {
      if (err) {
        console.error('getKeyDetailsSet', err);
        return next(err);
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

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
