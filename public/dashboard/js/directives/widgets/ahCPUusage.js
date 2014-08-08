define(['app'], function (app) {
  app.directive('ahCpuusage', function ($interval) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      template: '<div><input type="text" class="knob" value="" data-width="80" data-height="90" data-readOnly="true" data-fgColor="#39CCCC"/><div class="knob-label">CPU</div></div>',
      link: function (scope) {
        $(".knob").knob({inline: false});
        function update() {
          $.get('/api/getCPUusage', function (data) {
            $('.knob')
              .val(data.cpuusage * 100)
              .trigger('change');

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