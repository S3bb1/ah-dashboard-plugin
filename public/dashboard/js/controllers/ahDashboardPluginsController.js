define(['app'], function (app) {
  app.controller('ahDashboardPlugins', function ($scope, ngDialog) {
    $.get('/api/getPlugins', function (data) {
      $scope.plugins = data.plugins;
      $scope.pluginsLoadingDone = true;
      $scope.$apply();

      $scope.open = function (html) {
        ngDialog.open({
          template: html,
          plain: true,
          className: 'ngdialog-theme-default',
          scope: $scope
        });
      };

    });
  });
});