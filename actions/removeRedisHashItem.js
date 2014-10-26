var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'removeRedisHashItem';
action.description = 'I will remove a Item out of a Redis Hash';
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

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
