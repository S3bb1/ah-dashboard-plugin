var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getAllRedisKeys';
action.description = 'I will return all redis keys';
action.inputs = {
  'required' : [],
  'optional' : ['prefix']
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
	var separator = ':';
	var query;
	var prefix = connection.params.prefix;
	if(prefix){
		query = prefix + separator + '*';
	} else {
		query = '*';
	}
	api.redis.client.keys(query, function (err, keys) {
    if (err) {

      console.error('getKeys', err);
    } else {
    	console.dir(keys);
			var lookup = {};
      var reducedKeys = [];
      keys.forEach(function (key) {
        var fullKey = key;
        if (prefix) {
          key = key.substr((prefix + separator).length);
        }
        var parts = key.split(separator);
        var firstPrefix = parts[0];
        if (lookup.hasOwnProperty(firstPrefix)) {
          lookup[firstPrefix].count++;
        } else {
          lookup[firstPrefix] = {
            attr: { id: firstPrefix },
            count: parts.length === 1 ? 0 : 1
          };
          lookup[firstPrefix].fullKey = fullKey;
          if (parts.length === 1) {
            lookup[firstPrefix].leaf = true;
          }
          reducedKeys.push(lookup[firstPrefix]);
        }
      });

      reducedKeys.forEach(function (data) {
        if (data.count === 0) {
          data.title = data.attr.id;
        } else {
          data.title = data.attr.id + ":* (" + data.count + ")";
          data.lazy = true;
          data.folder = true;
        }
      });
    	connection.response.redisKeys = reducedKeys;

    	next(connection, true);

    }

  });

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
