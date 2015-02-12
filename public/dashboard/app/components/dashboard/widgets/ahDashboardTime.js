define(['app'], function(app){
  app.directive('ahTime', function ($interval) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      template: '<div><h3>{{time}}</h3></div>',
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