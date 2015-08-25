define(['app'], function (app) {
  app.factory('ahDashboardCommunicationService', function (ahDashboardSession) {
    var ahClient = new actionheroClient();
    var actionEmit = function(action, params, callback){
      if(ahDashboardSession || (action === "login" || action === "logout" || action === "currentUser")){
        var ahCallback = function(response) {
          // Based on the latest version of actionheroClient.js, error is stuffed into the response.
          if(response && response.error) {
            if(typeof callback === 'function') callback(response.error, response);
            else if(typeof params === 'function') params(response.error, response);
          } else {
            if(typeof callback === 'function') callback(null, response);
            else if(typeof params === 'function') params(response.error, response);
          }
        };
        if(action === "login") {
          params.action = "login";
          ahClient.actionWeb(params, ahCallback);
          return;
        }
        ahClient.action(action, params, ahCallback);
      }
      return;
    };
    return {
      action : actionEmit,
      ahClient : ahClient
    };
  });
});