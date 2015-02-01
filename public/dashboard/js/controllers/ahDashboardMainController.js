define(['app'], function (app) {
  app.controller('ahDashboardMain', function ($scope, $route, $location, $rootScope, ahDashboardAuthService, ahDashboardSession) {
    $scope.$route = $route;
    $scope.session = ahDashboardSession;
    $scope.isLoginPage = function(){
      return "/login" === $location.path();
    };
  });
});