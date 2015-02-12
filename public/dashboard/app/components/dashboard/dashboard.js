define(['app', 
        'components/dashboard/dashboard-template',
        'components/dashboard/widgets/ahCPUusage',
        'components/dashboard/widgets/dashboardStats/ahDashboardStats',
        'components/dashboard/widgets/ahDashboardTime',
        'components/dashboard/widgets/ahRAMusage',
        'components/dashboard/widgets/ahTasksStats',
        'components/dashboard/widgets/ahUptime'], function (app) {
  app.controller('ahDashboard', function ($scope, $rootScope, $interval, $window, widgetDefinitions, defaultWidgets) {

    $scope.dashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets,
      hideWidgetName: true,
      hideToolbar: true,
      storage: $window.localStorage,
      storageId: 'ahDashboard',
      sortableOptions: {
        handle: '.box-header'
      }
    };
    $rootScope.$on('ahDashboardWidgetAdded', function (srcevent, event, widget) {
      $scope.addWidgetInternal(event, widget);
    });
  });
});