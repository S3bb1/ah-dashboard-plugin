module.exports = {
  start: function(api, next){
    var path = require('path');
    var crypto = require('crypto');
    var fs = require('fs');
    var TS = require('redis-timeseries');
    var Tail = require('always-tail');
    var timeSeries = new TS(api.redis.client);
    api.ahDashboard = {};
    api.ahDashboard.timesSeries = timeSeries;
    api.ahDashboard.prevStats = {};
    var redisPrefix = "__users-";
    var caluculatePasswordHash = function(password, salt){
      return crypto.createHash('sha256').update(salt + password).digest("hex");
    }
    var cacheKey = function(email){
      return redisPrefix + email.replace("@","_").replace(".","_")
    }

    var passwordSalt = api.utils.randomString(64);
    var passwordHash = caluculatePasswordHash("password", passwordSalt);
    var user = {
      email: "admin",
      passwordSalt: passwordSalt,
      passwordHash: passwordHash,
    };
    console.log(cacheKey("admin"));
    api.cache.save(cacheKey("admin"), user, function(error){
    });

    var logFile = api.config.general.paths.log[0] + path.sep + api.pids.title + '.log';
    if(fs.existsSync(logFile)) {
      api.chatRoom.add("logMessages");
      var logFileStats = fs.statSync(logFile);
      tail = new Tail(logFile, null, {start: logFileStats["size"]});

      tail.on("line", function (data) {
        api.chatRoom.broadcast({room: "logMessages"}, "logMessages", data.toString());
      });

      tail.on("error", function (error) {
        console.log('ERROR reading log file: ' + error);
      });
    } else {
      console.log('Cant locate log files, log file view in dashboard is disabled.')
    }
  
    api.session = {
      prefix: "__session:",
      duration: 60 * 60 * 1000, // 1 hour
    };

    api.session.connectionKey = function(connection){
      return api.session.prefix + connection.fingerprint;
    }
   
    api.session.save = function(connection, session, next){
      var key = api.session.connectionKey(connection);
      api.cache.save(key, session, api.session.duration, function(error){
        if(typeof next == "function"){ next(error); };
      });
    }
   
    api.session.load = function(connection, next){
      var key = api.session.connectionKey(connection);
      api.cache.load(key, function(error, session, expireTimestamp, createdAt, readAt){
        if(typeof next == "function"){ 
          next(error, session, expireTimestamp, createdAt, readAt); 
        }
      });
    }
   
    api.session.delete = function(connection, next){
      var key = api.session.connectionKey(connection);
      api.cache.destroy(key, function(error){
        next(error);
      });
    }

    api.session.generateAtLogin = function(connection, cacheKey, next){
      var session = {
        loggedIn: true,
        loggedInAt: new Date().getTime(),
        cacheKey: cacheKey
      }
      api.session.save(connection, session, function(error){
        next(error);
      });
    }
   
    api.session.checkAuth = function(connection, successCallback, failureCallback){
      api.session.load(connection, function(error, session){
        if(session === null){ session = {}; }
        if(session.loggedIn !== true){
          connection.error = "You need to be authorized for this action";
          failureCallback(connection, true); // likley to be an action's callback
        }else{
          successCallback(session); // likley to yiled to action
        }
      });
    }

    next();
  }
}