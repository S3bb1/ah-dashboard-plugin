define(['app'], function (app) {
  app.directive('ahRamusage', function ($interval, ahDashboardCommunicationService) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      templateUrl: 'app/components/dashboard/widgets/ahRAMusage/ahRAMusage.html',
      link: function (scope) {
        scope.directiveId = "knob_ram_" + scope.$id;
        function update() {
          ahDashboardCommunicationService.action('getRAMusage', function (err, data) {
            var usedMem = Math.round(data.totalmem) -  Math.round(data.freemem);
            $('#'+scope.directiveId)
              .val(usedMem)
              .attr('data-max', Math.round(data.totalmem))
              .trigger('change');
            $('#'+scope.directiveId).knob({inline: true});

          });

        }

        update();

        var promise = $interval(update, 10000);

        scope.$on('$destroy', function () {
          $interval.cancel(promise);
        });
      }
    };
  });
});