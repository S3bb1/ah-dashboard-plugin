var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'updateRedisStrItem';
action.description = 'I will update a Redis String';
action.inputs = {
  'required' : ['value', 'keyPath'],
  'optional' : []
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
  api.redis.client.set(connection.params.keyPath, connection.params.value, function(err, res){
    api.redis.client.get(connection.params.keyPath, function (err, val) {
      if (err) {
        console.error('getKeyDetailsString', err);
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

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
