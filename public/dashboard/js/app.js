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
      .otherwise({
        redirectTo: '/'
      });
  });
  app.factory('widgetDefinitions', function () {
      return [
        {
          name: 'time',
          directive: 'ah-time',
          title: 'Current Time',
          style: {
            width: '300px'
          }
        },
        {
          name: 'stats',
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
          title: 'ActionHero CPU Usage',
          directive: 'ah-cpuusage'
        }
      ];
    })
    .value('defaultWidgets', [
      { name: 'stats', title: 'ActionHero Stats Statistics', style: {
        width: '100%'
      } },
      { name: 'cpuusage', style: {
        width: '300px'
      } },
      { name: 'time'}
    ])
  return app;
});