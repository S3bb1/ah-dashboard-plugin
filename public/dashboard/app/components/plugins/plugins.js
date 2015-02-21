define(['app'], function (app) {
  app.controller('ahDashboardPlugins', function ($scope, ngDialog, ahDashboardCommunicationService) {
    ahDashboardCommunicationService.action('getPlugins', function (err, data) {
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