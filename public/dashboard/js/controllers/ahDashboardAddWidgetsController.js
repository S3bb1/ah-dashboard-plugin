define(['app'], function (app) {
  app.controller('ahDashboardAddWidgets', function ($scope, $rootScope, $window, widgetDefinitions, defaultWidgets) {

    $scope.widgetDefinitions = widgetDefinitions;
    $scope.addWidget = function (event, widget) {
      $rootScope.$emit('ahDashboardWidgetAdded', event, widget);
    };

  });
})
