define(['app'], function (app) {
  app.factory('ahDashboardCommunicationService', function (ahDashboardSession) {
    var ahClient = new actionheroClient();
    var actionEmit = function(action, params, callback){
      if(ahDashboardSession || (action === "login" || action === "logout" || action === "currentUser")){
        ahClient.action(action, params, callback);
      }
      return;
    };
    return {
      action : actionEmit,
      ahClient : ahClient
    };
  });
});