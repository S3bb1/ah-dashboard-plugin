define(['app'], function (app) {
  app.directive('ahCpuusage', function ($interval, ahDashboardCommunicationService) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      template: '<div><div style="position: relative; left: 100px"><input type="text" class="knob" id="{{directiveId}}" value="" data-width="80" data-height="90" data-readOnly="true" data-fgColor="#39CCCC"/></div><div class="knob-label">CPU</div></div>',
      link: function (scope) {
        scope.directiveId = "knob_cpu_" + scope.$id;
        function update() {
          ahDashboardCommunicationService.action('getCPUusage', function (err, data) {
            $('#'+scope.directiveId)
              .val(Math.round(data.cpuusage * 100))
              .trigger('change');
            $('#'+scope.directiveId).knob({inline: false});
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