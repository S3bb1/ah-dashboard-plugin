module.exports = {
  startPriority: 1020,
  start: function(api, next){
    api.log("init session handling");

    var crypto = require('crypto');
    var async = require('async');

    api.ahDashboard.users = {};

    /**
     * redis prefix for stored users
     * @type {String}
     */
    api.ahDashboard.users.redisPrefix = "__users-";
    
    ////////////////////////////////////////////////////////////////////////////
     // generate a random string
    api.utils.randomString = function(length, chars){
      var result = '';
      if(!chars){
         chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
       }
       for(var i = length; i > 0; --i){ result += chars[Math.round(Math.random() * (chars.length - 1))] }
       return result;
     };

     
    /**
     * creates a new user in redis
     * @param {String}   username  new username
     * @param {String}   email     email of the user
     * @param {String}   password  desired password
     * @param {String}   firstName Fristname of the User
     * @param {String}   lastName  Lastname of the User
     * @param {Function} callback  Callback function if user is created
     */
    api.ahDashboard.users.addUser = function(username, email, password, firstName, lastName, callback){
      var passwordSalt = api.utils.randomString(64);
      var passwordHash = api.ahDashboard.users.caluculatePasswordHash(password, passwordSalt);
      var user = {
        email: email,
        username: username,
        firstName: firstName,
        lastName: lastName,
        passwordSalt: passwordSalt,
        passwordHash: passwordHash,
      };

      api.cache.save(api.ahDashboard.users.cacheKey(username), user, function(error){
        callback(error);
      });
    };

    /**
     * update a user in redis
     * @param {String}   username  new username
     * @param {String}   email     email of the user
     * @param {String}   password  desired password
     * @param {String}   firstName Fristname of the User
     * @param {String}   lastName  Lastname of the User
     * @param {Function} callback  Callback function if user is successfully edited
     */
    api.ahDashboard.users.editUser = function(username, email, password, firstName, lastName, callback){
      api.cache.load(api.ahDashboard.users.cacheKey(username), function(error, user, expireTimestamp, createdAt, readAt){
        var editedUser = {
          email: email,
          username: username,
          firstName: firstName,
          lastName: lastName,
          passwordSalt: user.passwordSalt,
          passwordHash: user.passwordHash,
        };

        api.cache.save(api.ahDashboard.users.cacheKey(username), editedUser, function(error){
          callback(error);
        });
      });
    };

    /**
     * delete a user in redis
     * @param {String}   username  new username
     * @param {String}   email     email of the user
     * @param {String}   password  desired password
     * @param {String}   firstName Fristname of the User
     * @param {String}   lastName  Lastname of the User
     * @param {Function} callback  Callback function if user is successfully edited
     */
    api.ahDashboard.users.deleteUser = function(username, callback){
      api.cache.destroy(api.ahDashboard.users.cacheKey(username), function(error){
        callback(error);
      });
    };

    /**
     * creates a sha256 password hash with a given salt
     * @param  {string} password a given password
     * @param  {string} salt     a given salt for the password
     * @return {string}           a calculated hash for the pw + salt
     */
    api.ahDashboard.users.caluculatePasswordHash = function(password, salt){
      return crypto.createHash('sha256').update(salt + password).digest("hex");
    };

    /**
     * calculates a cache key for a given username
     * @param username - username from current user
     * @return cache key for given username
     */
    api.ahDashboard.users.cacheKey = function(username){
      return api.ahDashboard.users.redisPrefix + username.replace("@","_").replace(".","_");
    };

    api.ahDashboard.users.getUsers = function(callback){
      api.redis.clients.client.keys(api.cache.redisPrefix + api.ahDashboard.users.redisPrefix+'*', function(err, users){
        async.map(users, function(item, callback){
          api.redis.clients.client.get(item, function (err, user) {
            if (err) {
              api.log('cant read user: ' + err, 'error');
            }
            var userObj;
            try{
              userObj = JSON.parse(user);
            } catch(e){
              api.log('cant parse user: ' + e, 'error');
            }
            callback(null, userObj);
          });
        }, function(err, users){
          callback(err, users);
        });
      });
    };

    /**
     * log in a given connection
     * @param  {Object}   data       current data object
     * @param  {Function} callback   callback function with err and success param
     */
    api.ahDashboard.users.login = function(data, callback){
      var username = data.params.username;
      var password = data.params.password;
      // generate user cache key with username
      var userCacheKey = api.ahDashboard.users.cacheKey(username);
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
            api.ahDashboard.session.generateAtLogin(data, userCacheKey, function(){
              callback(null, user);
            });
          }
        }
      });
    };
    
    // initially create a temporarily admin user
    api.ahDashboard.users.addUser("admin", "admin@ahDashboard.com", "admin", "Admin", "Istrator", function(){
      api.log("created admin user");
    });
    next();
  }
};