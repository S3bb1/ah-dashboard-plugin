define(['app'], function (app) {
  app.factory('ahDashboardAuthService', function ($http, $q, ahDashboardSession, ahDashboardCommunicationService) {
    var ahDashboardAuthService = {};
   
    ahDashboardAuthService.login = function (credentials) {
      var deferred = $q.defer();
      ahDashboardCommunicationService.action('login', credentials, function(err, response){
        if(err || !response.auth){
          deferred.reject();
        } else {
          ahDashboardSession.create(response.username, response.firstName, response.lastName, response.email, response.fingerprint);
          deferred.resolve();
        }
      });
      return deferred.promise;
    };
  
    ahDashboardAuthService.logout = function () {
      var deferred = $q.defer();
      ahDashboardCommunicationService.action('logout', function(err, response){
        ahDashboardSession.destroy();
        deferred.resolve();
      });
      return deferred.promise;
    };

    ahDashboardAuthService.isAuthenticated = function () {
      var deferred = $q.defer();
      if(ahDashboardSession.username){
        deferred.resolve();
      } else {
        ahDashboardCommunicationService.action('currentUser', function(err, response){
          if(err || !response.auth){
            ahDashboardSession.authChecking = false;
            deferred.reject();
          } else {
            ahDashboardSession.create(response.username, response.firstName, response.lastName, response.email, response.fingerprint);
            ahDashboardSession.authChecking = false;
            deferred.resolve();
          }
        });
      }
      return deferred.promise;
    };
   
    return ahDashboardAuthService;
  });
});