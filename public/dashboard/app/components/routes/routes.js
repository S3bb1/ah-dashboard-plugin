define(['app'], function (app) {
  app.controller('ahDashboardRoutes', function ($scope, ahDashboardCommunicationService) {
    ahDashboardCommunicationService.action('getRoutes', function(err, data){
      $scope.routes = data.routes;
      $scope.routesLoadingDone = true;
      $scope.$apply();
    });
  });
});