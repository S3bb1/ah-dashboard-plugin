var action = {};

/////////////////////////////////////////////////////////////////////
// libraries
var async = require('async');

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getRedisInfos';
action.description = 'I will return all informations about the current redis/fakeredis/sentinel cluster';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function (api, data, next) {
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    
    // Base response object
    var response = {
      redisType : null,
      redisMode : null,
      redisInfo : null,
      sentinelServers: null
    };

    // require the configured redis package
    var redisPackage = require('../../actionhero/node_modules/'+api.config.redis.pkg);

    // check if the config contains sentinel options
    if(api.config.redis.options && api.config.redis.options.sentinels){
      response.sentinelServers = [];

      // when sentinels available, iterate throu all
      async.each(api.config.redis.options.sentinels, function(sentinelInfo, callback){

        // open a connection to the current sentinel
        var redisSentinel = redisPackage.createClient(sentinelInfo.port, sentinelInfo.host);
        redisSentinel.on('error', function(){
          console.dir(arguments);
        });

        // request the sentinel info
        redisSentinel.info(function(err, res){

          // parse the info response
          var info = {};

          var lines = res.split('\r\n');
          for (var i = 0; i < lines.length; ++i) {
            var parts = lines[i].split(':');
            if (parts[1]) {
              info[parts[0]] = parts[1];
            }
          }

          // after successful parsing, close the connection 
          redisSentinel.disconnect();
          // and push it to the response
          response.sentinelServers.push(info);
          callback();
        });
      }, function(err){
          // when all sentinels were successfully parsed, get the info from the redis database      
          response.redisType = 'sentinel';
          response.redisMode = 'sentinel';
          api.redis.client.info(function (err, res) {
            var info = {};

            var lines = res.split('\r\n');
            for (var i = 0; i < lines.length; ++i) {
              var parts = lines[i].split(':');
              if (parts[1]) {
                info[parts[0]] = parts[1];
              }
            }
            // add the redis info to the response
            response.redisServer = info;
            // and finally add it to the connection
            data.response = response;
            next();
          });
      });
    } else if(api.config.redis.pkg === 'fakeredis'){
      // when fakeredis ... no infos are available :-/
      data.response.type="fakeredis";
      next();
    } else {
      // when normal redis client is configured, only get the redis info
      api.redis.client.info(function (err, res) {
        // parse the info response
        var info = {};

        var lines = res.split('\r\n');
        for (var i = 0; i < lines.length; ++i) {
          var parts = lines[i].split(':');
          if (parts[1]) {
            info[parts[0]] = parts[1];
          }
        }
        // add it to the response object
        response.redisType = 'singleMode';
        response.redisMode = info.redis_mode;
        response.redisInfo = info;

        // and finally to the connection
        data.response = response;
        next();
      });
    }
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;