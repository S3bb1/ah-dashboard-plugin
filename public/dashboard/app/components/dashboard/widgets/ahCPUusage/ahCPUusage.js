define(['app'], function (app) {
  app.directive('ahCpuusage', function ($interval, ahDashboardCommunicationService) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      templateUrl: 'app/components/dashboard/widgets/ahCPUusage/ahCPUusage.html',
      link: function (scope) {
        scope.directiveId = "knob_cpu_" + scope.$id;
        function update() {
          ahDashboardCommunicationService.action('getCPUusage', function (err, data) {
            $('#'+scope.directiveId)
              .val(Math.round(data.cpuusage * 100))
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