define(['app'], function (app) {
  app.directive('ahUptime', function ($interval, ahDashboardCommunicationService) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      template: '<div><h3>{{time}}</h3></div>',
      link: function (scope) {
        scope.ahUptime = 0;
        function update() {
          if(scope.ahUptime === 0){
            ahDashboardCommunicationService.action('status', function (err, data) {
              var seconds = data.uptime/1000;
              scope.ahUptime = seconds;
              parseSeconds();
            });
          } else {
            scope.ahUptime++;
            parseSeconds();
          }
        }
        function parseSeconds(){
          var sec_num = parseInt(scope.ahUptime, 10); // don't forget the second param
          var hours   = Math.floor(sec_num / 3600);
          var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
          var seconds = sec_num - (hours * 3600) - (minutes * 60);

          if (hours   < 10) {hours   = "0"+hours;}
          if (minutes < 10) {minutes = "0"+minutes;}
          if (seconds < 10) {seconds = "0"+seconds;}
          scope.time    = hours+':'+minutes+':'+seconds;
        }
        update();

        var promise = $interval(update, 1000);

        scope.$on('$destroy', function () {
          $interval.cancel(promise);
        });
      }
    };
  });
});