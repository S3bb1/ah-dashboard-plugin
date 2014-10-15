var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'updateRedisHashItem';
action.description = 'I will remove a Item out of a Redis Hash';
action.inputs = {
  'required' : ['item', 'keyPath', 'value'],
  'optional' : []
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
  api.redis.client.hset(connection.params.keyPath, connection.params.item, connection.params.value, function(err, res){
    api.redis.client.hgetall(connection.params.keyPath, function (err, fieldsAndValues) {
      if (err) {
        console.error('getKeyDetailsHash', err);
      }
      console.dir(fieldsAndValues);
      var details = {
        key: connection.params.keyPath,
        type: 'hash',
        data: fieldsAndValues
      };
      connection.response.details = details;
      next(connection, true);
    });
  });

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
