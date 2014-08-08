define(['app'], function (app) {
  app.controller('ahDashboard', function ($scope, $rootScope, $interval, $window, widgetDefinitions, defaultWidgets) {

    $scope.dashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets,
      hideWidgetName: true,
      hideToolbar: true,
      storage: $window.localStorage,
      storageId: 'demo',
      sortableOptions: {
        handle: '.box-header'
      }
    };
    $rootScope.$on('ahDashboardWidgetAdded', function (srcevent, event, widget) {
      $scope.addWidgetInternal(event, widget);
    });
    $scope.randomValue = Math.random();
    $interval(function () {
      $scope.randomValue = Math.random();
    }, 500);

  });
});