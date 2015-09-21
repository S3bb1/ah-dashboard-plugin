define(['app'], function (app) {
  app.controller('ahDashboardLogging', function ($scope, ahDashboardCommunicationService) {
    $scope.logMessages = [];
    ahDashboardCommunicationService.ahClient.on('connected', function () {
      console.log('connected!');
    });
    ahDashboardCommunicationService.ahClient.on('disconnected', function () {
      console.log('disconnected :(');
    });
    ahDashboardCommunicationService.ahClient.on('say', function (logMessage) {
      try {
        $scope.$apply(function () {
            $scope.logMessages.push(logMessage.message);
          });
      } catch (e) {
        console.log("Cant parse log object : " + logMessage.message + " Details: " + e);
      }

    });
    ahDashboardCommunicationService.ahClient.connect(function (err, details) {
      ahDashboardCommunicationService.ahClient.roomLeave("logMessages", function(err, response){
        ahDashboardCommunicationService.ahClient.roomAdd("logMessages");
      });
    });

    $scope.$on("$destroy", function() {
      if(ahDashboardCommunicationService.ahClient.state != "disconnected"){
        ahDashboardCommunicationService.ahClient.disconnect();
      }
    });

  });
});