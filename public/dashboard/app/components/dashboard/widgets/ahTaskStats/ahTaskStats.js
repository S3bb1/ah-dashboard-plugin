define(['app'], function(app){
  app.directive('ahTaskstats', function ($interval, ahDashboardCommunicationService) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      templateUrl: 'app/components/dashboard/widgets/ahTaskStats/ahTaskStats.html',
      link: function (scope) {
        scope.error = '';
        function loadResqueStatus(){
          ahDashboardCommunicationService.action('getResqueStatus', function(err, data){
            if(data.errorMessage){
                  scope.error = '<div class="callout callout-danger">'+
                                 '  <h4>Error:</h4>'+
                                 '  <p>'+data.errorMessage+'</p>'+
                                 '</div>';
            } 
            scope.delayedJobs = [];
            for (var a in data.delayed) {
              var delayedJobsAt = data.delayed[a];
              for(var i=0; i<delayedJobsAt.length; i++){
                var delayedJob = delayedJobsAt[i];
                delayedJob.delayedAt = a;
                scope.delayedJobs.push(delayedJob);
              }

            }
            scope.loadingDone = true;

            scope.runningJobs = [];
            for (var worker in data.details.workers) {
              if(data.details.workers[worker].run_at){
                var runningJob = data.details.workers[worker];
                runningJob.worker = worker;
                scope.runningJobs.push(runningJob);    
              }
            }

            scope.failedJobs = [];
            for (var j=0; j<data.failedJobs.length; j++) {
              var failedJob = data.failedJobs[j];
              scope.failedJobs.push(failedJob);
            }
            scope.$apply();
          });
        };
        loadResqueStatus();
      }
    };
  });
});