var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getRedisKeyValue';
action.description = 'I will return a value for given redis key';
action.inputs = {
  key: {
    required: true
  },
  index: {
    required: false
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
    var key = data.params.key;
    api.redis.clients.client.type(key, function (err, type) {
      if (err) {
        api.log('Redis Type Error: ' + err, 'error');
      }
      switch (type) {
        case 'string':
          getKeyDetailsString(key, api.redis.clients.client, data, next);
          break;
        case 'list':
          getKeyDetailsList(key, api.redis.clients.client, data, next);
          break;
        case 'zset':
          getKeyDetailsZSet(key, api.redis.clients.client, data, next);
          break;
        case 'hash':
          getKeyDetailsHash(key, api.redis.clients.client, data, next);
          break;
        case 'set':
          getKeyDetailsSet(key, api.redis.clients.client, data, next);
          break;
        default:
          var details = {
            key: key,
            type: type
          };
          data.response.details = details;
          next();
      }
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;


/////////////////////////////////////////////////////////////////////
// helper

function getKeyDetailsString (key, redisConnection, data, next) {
  redisConnection.get(key, function (err, val) {
    if (err) {
      api.log('getRedisString: ' + err, 'error');
    }

    var details = {
      key: key,
      type: 'string',
      value: val
    };
    
    data.response.details = details;
    next();
  });
}

function getKeyDetailsList (key, redisConnection, data, next) {
  var startIdx = parseInt(data.params.index, 10);
  if (typeof(startIdx) == 'undefined' || isNaN(startIdx) || startIdx < 0) {
    startIdx = 0;
  }
  var endIdx = startIdx + 19;
  redisConnection.lrange(key, startIdx, endIdx, function (err, items) {
    if (err) {
      api.log('getRedisDetailsList: ' + err, 'error');
    }

    var i = startIdx;
    items = items.map(function (item) {
      return {
        number: i++,
        value: item
      };
    });
    redisConnection.llen(key, function (err, length) {
      if (err) {
        api.log('getRedisDetailsList: ' + err, 'error');
      }
      var details = {
        key: key,
        type: 'list',
        items: items,
        beginning: startIdx <= 0,
        end: endIdx >= length - 1,
        length: length
      };
      data.response.details = details;
      next();
    });
  });
}

function getKeyDetailsHash (key, redisConnection, data, next) {
  redisConnection.hgetall(key, function (err, fieldsAndValues) {
    if (err) {
      api.log('getKeyDetailsHash: ' + err, 'error');
    }
    var details = {
      key: key,
      type: 'hash',
      data: fieldsAndValues
    };
    data.response.details = details;
    next();
  });
}

function getKeyDetailsSet (key, redisConnection, data, next) {
  redisConnection.smembers(key, function (err, members) {
    if (err) {
      api.log('getKeyDetailsSet: ' + err, 'error');
    }

    var details = {
      key: key,
      type: 'set',
      members: members
    };
    data.response.details = details;
    next();
  });
}

function getKeyDetailsZSet (key, redisConnection, data,  next) {
  var startIdx = parseInt(data.params.index, 10);
  if (typeof(startIdx) == 'undefined' || isNaN(startIdx) || startIdx < 0) {
    startIdx = 0;
  }
  var endIdx = startIdx + 19;
  redisConnection.zrange(key, startIdx, endIdx, 'WITHSCORES', function (err, items) {
    if (err) {
      api.log('getKeyDetailsZSet: ' + err, 'error');
    }

    items = mapZSetItems(items);

    var i = startIdx;
    items.forEach(function (item) {
      item.number = i++;
    });
    redisConnection.zcount(key, "-inf", "+inf", function (err, length) {
      var details = {
        key: key,
        type: 'zset',
        items: items,
        beginning: startIdx <= 0,
        end: endIdx >= length - 1,
        length: length
      };
      data.response.details = details;
      next();
    });
  });
}

function mapZSetItems (items) {
  var results = [];
  for (var i = 0; i < items.length; i += 2) {
    results.push({
      score: items[i + 1],
      value: items[i]
    });
  }
  return results;
}