define(['app'], function (app) {
  app.controller('ahDashboardLogging', function ($scope) {
    var ahClient = new actionheroClient;
    $scope.logMessages = [];
    ahClient.on('connected', function () {
      console.log('connected!')
    });
    ahClient.on('disconnected', function () {
      console.log('disconnected :(')
    });
    ahClient.on('say', function (logMessage) {
      try {
        var logmessages = logMessage.message.split('\n');
        for (var message in logmessages) {
          var logObj = JSON.parse(logmessages[message]);
          $scope.$apply(function () {
            $scope.logMessages.push(logObj);
          });
        }
      } catch (e) {
        console.log("Cant parse log object : " + logMessage.message + " Details: " + e);
      }

    });

    ahClient.connect(function (err, details) {
      ahClient.roomAdd("logMessages");
    });

  });
});