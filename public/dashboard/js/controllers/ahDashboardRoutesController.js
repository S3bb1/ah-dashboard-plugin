define(['app'], function (app) {
  app.controller('ahDashboardRoutes', function ($scope) {
    $.get('/api/getRoutes', function (data) {
      $scope.routes = data.routes;
    });
  });
});