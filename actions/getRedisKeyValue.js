var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getRedisKeyValue';
action.description = 'I will return a value for given redis key';
action.inputs = {
  'required' : ['key'],
  'optional' : ['index']
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
  var key = connection.params.key;
  api.redis.client.type(key, function (err, type) {
    if (err) {
      console.error('getKeyDetails', err);
    }
    switch (type) {
      case 'string':
        getKeyDetailsString(key, api.redis.client, connection, next);
        break;
      case 'list':
        getKeyDetailsList(key, api.redis.client, connection, next);
        break;
      case 'zset':
        getKeyDetailsZSet(key, api.redis.client, connection, next);
        break;
      case 'hash':
        getKeyDetailsHash(key, api.redis.client, connection, next);
        break;
      case 'set':
        getKeyDetailsSet(key, api.redis.client, connection, next);
        break;
      default:
        var details = {
          key: key,
          type: type
        };
        connection.response.details = details;
        next(connection, true);
    }
  });

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;


/////////////////////////////////////////////////////////////////////
// helper

function getKeyDetailsString (key, redisConnection, connection, next) {
  redisConnection.get(key, function (err, val) {
    if (err) {
      console.error('getKeyDetailsString', err);
    }

    var details = {
      key: key,
      type: 'string',
      value: val
    };
    
    connection.response.details = details;
    next(connection, true);
  });
}

function getKeyDetailsList (key, redisConnection, connection, next) {
  var startIdx = parseInt(connection.params.index, 10);
  if (typeof(startIdx) == 'undefined' || isNaN(startIdx) || startIdx < 0) {
    startIdx = 0;
  }
  var endIdx = startIdx + 19;
  redisConnection.lrange(key, startIdx, endIdx, function (err, items) {
    if (err) {
      console.error('getKeyDetailsList', err);
    }

    var i = startIdx;
    items = items.map(function (item) {
      return {
        number: i++,
        value: item
      }
    });
    redisConnection.llen(key, function (err, length) {
      if (err) {
        console.error('getKeyDetailsList', err);
        return next(err);
      }
      var details = {
        key: key,
        type: 'list',
        items: items,
        beginning: startIdx <= 0,
        end: endIdx >= length - 1,
        length: length
      };
      connection.response.details = details;
      next(connection, true);
    });
  });
}

function getKeyDetailsHash (key, redisConnection, connection, next) {
  redisConnection.hgetall(key, function (err, fieldsAndValues) {
    if (err) {
      console.error('getKeyDetailsHash', err);
    }
    console.dir(fieldsAndValues);
    var details = {
      key: key,
      type: 'hash',
      data: fieldsAndValues
    };
    connection.response.details = details;
    next(connection, true);
  });
}

function getKeyDetailsSet (key, redisConnection, connection, next) {
  redisConnection.smembers(key, function (err, members) {
    if (err) {
      console.error('getKeyDetailsSet', err);
      return next(err);
    }

    var details = {
      key: key,
      type: 'set',
      members: members
    };
    connection.response.details = details;
    next(connection, true);
  });
}

function getKeyDetailsZSet (key, redisConnection, connection,  next) {
  var startIdx = parseInt(connection.params.index, 10);
  if (typeof(startIdx) == 'undefined' || isNaN(startIdx) || startIdx < 0) {
    startIdx = 0;
  }
  var endIdx = startIdx + 19;
  redisConnection.zrange(key, startIdx, endIdx, 'WITHSCORES', function (err, items) {
    if (err) {
      console.error('getKeyDetailsZSet', err);

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
      connection.response.details = details;
      next(connection, true);
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