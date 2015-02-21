define(['app'], function (app) {
  app.controller('ahDashboardActions', function ($scope, ahDashboardCommunicationService) {
    $scope.actionDefinitions = [];
    ahDashboardCommunicationService.action('getDocumentation', function (err, data) {
      for (var action in data.documentation) {
        for (var details in data.documentation[action]) {
          var actionDefinition = {};
          actionDefinition = data.documentation[action][details];
          $scope.actionDefinitions.push(actionDefinition);
        }
      }
      $scope.actionsLoadingDone = true;
      $scope.$apply();
    });
  });
});