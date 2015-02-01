define(['app'], function (app) {
  app.controller('ahDashboardMain', function ($scope, $route, $location, $rootScope, ahDashboardAuthService, ahDashboardSession) {
    $scope.$route = $route;
    $scope.session = ahDashboardSession;
    $scope.isLoginPage = function(){
      return "/login" === $location.path();
    };

    $scope.logout = function(){
      ahDashboardAuthService.logout().then(function(err){
        $location.path("/login");
      });
    };
  });
});