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
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    var type = data.params.type;
    switch (type) {
      case 'string':
        api.redis.clients.client.set(data.params.key, '', function(err, res){
          data.response.err = err;
          next();
        });
        break;
      case 'list':
        api.redis.clients.client.lpush(data.params.key, '', function(err, res){
          data.response.err = err;
          next();
        });
        break;
      case 'set':
        api.redis.clients.client.sadd(data.params.key, '', function(err, res){
          data.response.err = err;
          next();
        });
        break;
      case 'zset':
        api.redis.clients.client.zadd(data.params.key, 1, '', function(err, res){
          data.response.err = err;
          next();
        });
        break;
      case 'hash':
        api.redis.clients.client.hset(data.params.key, '', '', function(err, res){
          data.response.err = err;
          next();
        });
        break;
      default:
        next();
    }
  }, next );
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
