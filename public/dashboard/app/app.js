define([
  'angular',
  'angular-route',
  'angular-dashboard',
  'angular-multiselect',
  'angular-markdown',
  'angular-sanitize',
  'angular-ui-sortable',
  'angular-bootstrap'
], function (angular) {

  var app = angular.module('app', [
    'ngRoute',
    'ui.dashboard',
    'btford.markdown',
    'angularjs-dropdown-multiselect',
    'ngDialog'
  ]);
  app.init = function () {
    angular.bootstrap(document, ['app']);
  };

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/components/dashboard/dashboard.html',
        controller: 'ahDashboard',
        title: 'simple',
        description: 'This is the simplest demo.'
      })
      .when('/actions', {
        templateUrl: 'app/components/actions/actions.html',
        controller: 'ahDashboardActions'
      })
      .when('/logging', {
        templateUrl: 'app/components/logging/logging.html',
        controller: 'ahDashboardLogging'
      })
      .when('/routes', {
        templateUrl: 'app/components/routes/routes.html',
        controller: 'ahDashboardRoutes'
      })
      .when('/plugins', {
        templateUrl: 'app/components/plugins/plugins.html',
        controller: 'ahDashboardPlugins'
      })
      .when('/tasks', {
        templateUrl: 'app/components/tasks/tasks.html',
        controller: 'ahDashboardTasks'
      })
      .when('/redis', {
        templateUrl: 'app/components/redisViewer/redisViewer.html',
        controller: 'ahDashboardRedisViewer'
      })
      .when('/login', {
        templateUrl: 'app/components/userLogin/userLogin.html',
        controller: 'ahDashboardLogin'
      })
      .when('/users', {
        templateUrl: 'app/components/users/users.html',
        controller: 'ahDashboardUsers'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function($rootScope, ahDashboardAuthService, $location){
    $rootScope.$on('$routeChangeStart', function (event, next) {
      ahDashboardAuthService.isAuthenticated().then(function(){
      }, function(){
        $location.path( "/login" );
      });
    });
  }).controller('ahDashboardMain', function ($scope, $route, $location, $rootScope, ahDashboardAuthService, ahDashboardSession) {
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
  return app;
});