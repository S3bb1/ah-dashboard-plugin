define(['app', 'angular'], function (app, angular) {
  app.controller('ahDashboardLogin', function ($scope, ahDashboardAuthService, $location) {
    $scope.credentials = {
      username: '',
      password: ''
    };
    $scope.login = function (credentials) {
      $scope.error = null;
      ahDashboardAuthService.login(credentials).then(function (user) {
        $location.path( "/" );
      }, function(err){
        $scope.error="Wrong Username or Password!";
      });
    };
  });
});