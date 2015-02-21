define(['app'], function (app) {
  app.directive('ahRamusage', function ($interval, ahDashboardCommunicationService) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      template: '<div><div style="position: relative; left: 100px"><input type="text" class="knob" id="{{directiveId}}" value="" data-width="80" data-height="90" data-readOnly="true" data-fgColor="#39CCCC"/></div><div class="knob-label">RAM</div></div>',
      link: function (scope) {
        scope.directiveId = "knob_ram_" + scope.$id;
        function update() {
          ahDashboardCommunicationService.action('getRAMusage', function (err, data) {
            var usedMem = Math.round(data.totalmem) -  Math.round(data.freemem);
            $('#'+scope.directiveId)
              .val(usedMem)
              .attr('data-max', Math.round(data.totalmem))
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