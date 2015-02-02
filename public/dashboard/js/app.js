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
        templateUrl: 'views/dashboard.html',
        controller: 'ahDashboard',
        title: 'simple',
        description: 'This is the simplest demo.'
      })
      .when('/actions', {
        templateUrl: 'views/actions.html',
        controller: 'ahDashboardActions'
      })
      .when('/logging', {
        templateUrl: 'views/logging.html',
        controller: 'ahDashboardLogging'
      })
      .when('/routes', {
        templateUrl: 'views/routes.html',
        controller: 'ahDashboardRoutes'
      })
      .when('/plugins', {
        templateUrl: 'views/plugins.html',
        controller: 'ahDashboardPlugins'
      })
      .when('/tasks', {
        templateUrl: 'views/tasks.html',
        controller: 'ahDashboardTasks'
      })
      .when('/redis', {
        templateUrl: 'views/redis.html',
        controller: 'ahDashboardRedisViewer'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'ahDashboardLogin'
      })
      .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'ahDashboardUsers'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function($rootScope, ahDashboardAuthService, $location){
    $rootScope.$on('$routeChangeStart', function (event, next) {
      event.preventDefault();
      ahDashboardAuthService.isAuthenticated().then(function(){
      }, function(){
        $location.path( "/login" );
      });
    });
  });
  app.factory('widgetDefinitions', function () {
      return [
        {
          name: 'time',
          displayName : 'Current Time',
          directive: 'ah-time',
          title: 'Current Time',
          style: {
            width: '300px'
          }
        },
        {
          name: 'stats',
          displayName : 'Statistics',
          title: 'Stats Statistics',
          directive: 'ah-stats',
          settingsModalOptions: {
            templateUrl: 'template/widget-settings-stats-template.html',
            controller: 'WidgetSettingsCtrl'
          },
          onSettingsClose: function (result, widget) {
            jQuery.extend(true, widget, result);
            widget.attrs.stats = result.attrs.stats;
          },
          attrs: {
            stats: []
          },
          style: {
            width: '100%'
          }
        },
        {
          name: 'cpuusage',
          displayName : 'CPU Usage',
          title: 'CPU Usage',
          directive: 'ah-cpuusage',
          style: {
            width: '300px'
          }
        },
        {
          name: 'taskstats',
          displayName : 'Tasks Stats',
          title: 'Tasks Stats',
          directive: 'ah-tasksstats',
          style: {
            width: '300px'
          }
        },
        {
          name: 'ramusage',
          displayName : 'RAM Usage',
          title: 'RAM Usage',
          directive: 'ah-ramusage',
          style: {
            width: '300px'
          }
        },
        {
          name: 'uptime',
          displayName : 'AH Uptime',
          title: 'Uptime',
          directive: 'ah-uptime',
          style: {
            width: '300px'
          }
        }
      ];
    })
    .value('defaultWidgets', [
      { name: 'stats' },
      { name: 'cpuusage' },
      { name: 'ramusage' },
      { name: 'uptime' },
      { name: 'time'},
      { name: 'taskstats'}
    ]);
  return app;
});