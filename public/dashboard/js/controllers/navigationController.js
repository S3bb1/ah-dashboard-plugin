define(['app'], function (app) {
  app.controller('navigationController', function ($scope, $route) {
    $scope.$route = $route;
  });
});