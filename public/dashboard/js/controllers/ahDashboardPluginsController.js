define(['app'], function (app) {
  app.controller('ahDashboardPlugins', function ($scope) {
    $.get('/api/getPlugins', function (data) {
      $scope.plugins = data.plugins;
      $scope.pluginsLoadingDone = true;
      $scope.$apply();
    });
  });
});