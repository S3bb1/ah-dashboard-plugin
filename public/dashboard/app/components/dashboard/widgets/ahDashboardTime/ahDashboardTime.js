define(['app'], function(app){
  app.directive('ahTime', function ($interval) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      templateUrl: 'app/components/dashboard/widgets/ahDashboardTime/ahDashboardTime.html',
      link: function (scope) {
        function update() {
          scope.time = new Date().toLocaleString();
        }

        update();

        var promise = $interval(update, 500);

        scope.$on('$destroy', function () {
          $interval.cancel(promise);
        });
      }
    };
  });
});