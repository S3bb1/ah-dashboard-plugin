define([
  'angular',
  'angular-route',
  'angular-dashboard',
  'angular-multiselect',
  'angular-markdown',
  'angular-sanitize',
  'angular-ui-sortable',
  'angular-bootstrap',
  'angular-dashboard'
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
      .otherwise({
        redirectTo: '/'
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
          title: 'ActionHero Stats Statistics',
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
          title: 'ActionHero CPU Usage',
          directive: 'ah-cpuusage',
          style: {
            width: '300px'
          }
        },
        {
          name: 'taskstats',
          displayName : 'Tasks Stats',
          title: 'ActionHero Tasks Stats',
          directive: 'ah-tasksstats',
          style: {
            width: '300px'
          }
        },
        {
          name: 'ramusage',
          displayName : 'RAM Usage',
          title: 'ActionHero RAM Usage',
          directive: 'ah-ramusage',
          style: {
            width: '300px'
          }
        },
        {
          name: 'uptime',
          displayName : 'AH Uptime',
          title: 'ActionHero Uptime',
          directive: 'ah-uptime',
          style: {
            width: '300px'
          }
        }
      ];
    })
    .value('defaultWidgets', [
      { 
        name: 'stats', 
        title: 'ActionHero Stats Statistics', 
        style: {
          width: '100%'
        } 
      },
      { name: 'cpuusage' },
      { name: 'ramusage' },
      { name: 'uptime' },
      { name: 'time'},
      { name: 'taskstats'}
    ])
  return app;
});