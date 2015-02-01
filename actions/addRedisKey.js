var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'addRedisKey';
action.description = 'I will add a empty key in redis';
action.inputs = {
  key: {
    required: true
  },
  type: {
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
    var type = connection.params.type;
    switch (type) {
      case 'string':
        api.redis.client.set(connection.params.key, '', function(err, res){
          connection.response.err = err;
          next(connection, true);
        });
        break;
      case 'list':
        api.redis.client.lpush(connection.params.key, '', function(err, res){
          connection.response.err = err;
          next(connection, true);
        });
        break;
      case 'set':
        api.redis.client.sadd(connection.params.key, '', function(err, res){
          connection.response.err = err;
          next(connection, true);
        });
        break;
      case 'zset':
        api.redis.client.zadd(connection.params.key, 1, '', function(err, res){
          connection.response.err = err;
          next(connection, true);
        });
        break;
      case 'hash':
        api.redis.client.hset(connection.params.key, '', '', function(err, res){
          connection.response.err = err;
          next(connection, true);
        });
        break;
      default:
        next(connection, true);
    }
  }, next );
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
