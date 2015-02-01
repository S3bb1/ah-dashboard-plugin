module.exports = {
  startPriority: 1020,
  start: function(api, next){
    api.log("init session handling");

    var crypto = require('crypto');

    api.ahDashboard.users = {};

    /**
     * redis prefix for stored users
     * @type {String}
     */
    api.ahDashboard.users.redisPrefix = "__users-";

    /**
     * creates a new user in redis db
     * @param {string}   email    chosen email adress
     * @param {string}   password chosen password
     * @param {Function} callback callback function with error param if a redis error exists
     */
    api.ahDashboard.users.addUser = function(email, password, callback){
      var passwordSalt = api.utils.randomString(64);
      var passwordHash = api.ahDashboard.users.caluculatePasswordHash(password, passwordSalt);
      var user = {
        email: email,
        passwordSalt: passwordSalt,
        passwordHash: passwordHash,
      };

      api.cache.save(api.ahDashboard.users.cacheKey(email), user, function(error){
        callback(error);
      });
    };

    /**
     * creates a sha256 password hash with a given salt
     * @param  {string} password a given password
     * @param  {string} salt     a given salt for the password
     * @return {strin}           a calculated hash for the pw + salt
     */
    api.ahDashboard.users.caluculatePasswordHash = function(password, salt){
      return crypto.createHash('sha256').update(salt + password).digest("hex");
    };

    /**
     * calculates a cache key for a given email adress
     * @param email - email adress from current user
     * @return cache key for given email adress
     */
    api.ahDashboard.users.cacheKey = function(email){
      return api.ahDashboard.users.redisPrefix + email.replace("@","_").replace(".","_");
    };

    /**
     * log in a given connection
     * @param  {Object}   connection current connection object
     * @param  {Function} callback   callback function with err and success param
     */
    api.ahDashboard.users.login = function(connection, callback){
      var email = connection.params.email;
      var password = connection.params.password;
      // generate user cache key with email
      var userCacheKey = api.ahDashboard.users.cacheKey(email);
      // load user from redis
      api.cache.load(userCacheKey, function(err, user){
        if(err){
          // generic redis error ?!
          callback(err);
        }else if(user === null){
          // no user found
          callback("User not found");
        }else{
          // user found check password
          var passwordHash = api.ahDashboard.users.caluculatePasswordHash(password, user.passwordSalt);
          if(passwordHash !== user.passwordHash){
            callback("incorrect password");
          }else{
            // password check success ... generate session for user
            api.ahDashboard.session.generateAtLogin(connection, userCacheKey, function(){
              callback(null, user);
            });
          }
        }
      });
    };
    
    // initially create a temporarily admin user
    api.ahDashboard.users.addUser("admin", "admin", function(){
      api.log("created admin user");
    });
    next();
  }
};