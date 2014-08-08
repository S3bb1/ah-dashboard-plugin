define(['app'], function (app) {
  app.controller('ahDashboardActions', function ($scope) {
    $.get('/api/getDocumentation', function (data) {
      $scope.actionDefinitions = [];
      for (var action in data.documentation) {
        for (var details in data.documentation[action]) {
          var actionDefinition = {};
          actionDefinition = data.documentation[action][details];
          $scope.actionDefinitions.push(actionDefinition);
        }
      }
    });
  });
});