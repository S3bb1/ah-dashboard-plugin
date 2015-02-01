module.exports = {
  startPriority: 1010,
  start: function(api, next){
    api.log("init session handling");

    api.ahDashboard.session = {
      prefix: "__session:",
      duration: 60 * 60 * 1000, // 1 hour
    };

    api.ahDashboard.session.connectionKey = function(connection){
      return api.ahDashboard.session.prefix + connection.fingerprint;
    };
   
    api.ahDashboard.session.save = function(connection, session, next){
      var key = api.ahDashboard.session.connectionKey(connection);
      api.cache.save(key, session, api.ahDashboard.session.duration, function(error){
        if(typeof next == "function"){ next(error); }
      });
    };
   
    api.ahDashboard.session.load = function(connection, next){ 
      var key = api.ahDashboard.session.connectionKey(connection);
      api.cache.load(key, function(error, session, expireTimestamp, createdAt, readAt){
        if(typeof next == "function"){
          next(error, session, expireTimestamp, createdAt, readAt); 
        }
      });
    };
   
    api.ahDashboard.session.delete = function(connection, next){
      var key = api.ahDashboard.session.connectionKey(connection);
      api.cache.destroy(key, function(error){
        next(error);
      });
    };

    api.ahDashboard.session.generateAtLogin = function(connection, cacheKey, next){
      var session = {
        loggedIn: true,
        loggedInAt: new Date().getTime(),
        cacheKey: cacheKey
      };
      api.ahDashboard.session.save(connection, session, function(error){
        next(error);
      });
    };
   
    api.ahDashboard.session.checkAuth = function(connection, successCallback, failureCallback){
      api.ahDashboard.session.load(connection, function(error, session){
        if(session === null){ session = {}; }
        if(session.loggedIn !== true){
          connection.error = "You need to be authorized for this action";
          failureCallback(connection, true); // likley to be an action's callback
        }else{
          successCallback(session); // likley to yiled to action
        }
      });
    };

    next();
  }
};