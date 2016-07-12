module.exports = {
  startPriority: 1010,
  start: function(api, next){
    api.log("init session handling");

    /**
     * session defaults
     * @type {Object}
     */
    api.ahDashboard.session = {
      prefix: "__session:",
      duration: 60 * 60 * 1000, // 1 hour
    };

    /**
     * generates a connection key for a session
     * @param  {Object} data       current data object
     * @return {String}            a connection key for the redis
     */
    api.ahDashboard.session.connectionKey = function(data){
      return api.ahDashboard.session.prefix + data.connection.fingerprint;
    };
   
    /**
     * saves a session key in the redis
     * @param  {Object}   data       current data object
     * @param  {Object}   session    Session object
     * @param  {Function} next       callback function after save
     */
    api.ahDashboard.session.save = function(data, session, next){
      var key = api.ahDashboard.session.connectionKey(data);
      api.cache.save(key, session, api.ahDashboard.session.duration, function(error){
        if(typeof next == "function"){ next(error); }
      });
    };
   
    /**
     * loads a session from a connection object
     * @param  {Object}   connection current connection object
     * @param  {Function} next       callback function for loaded session
     */
    api.ahDashboard.session.load = function(data, next){ 
      var key = api.ahDashboard.session.connectionKey(data);
      api.cache.load(key, function(error, session, expireTimestamp, createdAt, readAt){
        if(typeof next == "function"){
          next(error, session, expireTimestamp, createdAt, readAt); 
        }
      });
    };
    
    /**
     * deletes a session when a user loggs out
     * @param  {Object}   data       current data object
     * @param  {Function} next       callback function after delete
     */
    api.ahDashboard.session.delete = function(data, next){
      var key = api.ahDashboard.session.connectionKey(data);
      api.redis.clients.client.del(api.cache.redisPrefix + key, function(err, count){
        if(err){ 
          api.log(err, 'error'); 
        }
        var resp = true;
        if(count !== 1){ 
          resp = false;
        }
        if(typeof next === 'function'){ 
          next(null, resp); 
        }
      });
    };

    /**
     * generates a new session object after login
     * @param  {Object}   data       current data object
     * @param  {String}   cacheKey   generated user cacheKey
     * @param  {Function} next       callback after created session
     */
    api.ahDashboard.session.generateAtLogin = function(data, cacheKey, next){
      var session = {
        loggedIn: true,
        loggedInAt: new Date().getTime(),
        cacheKey: cacheKey
      };
      api.ahDashboard.session.save(data, session, function(error){
        next(error);
      });
    };
   
    /**
     * checks if the current connection is authenticated within a session
     * @param  {Object} connection      current connection Object
     * @param  {Function} successCallback success callback if a session exists
     * @param  {Function} failureCallback fail callback if no session exists
     */
    api.ahDashboard.session.checkAuth = function(data, successCallback, failureCallback){
      api.ahDashboard.session.load(data, function(error, session){
        if(session === null){ session = {}; }
        if(session.loggedIn !== true){
          data.connection.errorMessage = "You need to be authorized for this action";
          failureCallback(); // likley to be an action's callback
        }else{
          successCallback(session); // likley to yiled to action
        }
      });
    };

    next();
  }
};