define(['app'], function(app){
  app.directive('ahTaskstats', function ($interval, ahDashboardCommunicationService) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      templateUrl: 'app/components/dashboard/widgets/ahTaskStats/ahTaskStats.html',
      link: function (scope) {
        scope.error = '';
        ahDashboardCommunicationService.action('getAllRunningJobs', function (err, data) {
          if(data.errorMessage){
            scope.error = '<div class="callout callout-danger">'+
                           '  <h4>Error:</h4>'+
                           '  <p>'+data.errorMessage+'</p>'+
                           '</div>';
          } else {
            scope.runningJobs = data.runningJobs.length;
          }
        });
        ahDashboardCommunicationService.action('getDelayedJobs', function (err, data) {
          if(data.errorMessage){
            scope.error = '<div class="callout callout-danger">'+
                           '  <h4>Error:</h4>'+
                           '  <p>'+data.errorMessage+'</p>'+
                           '</div>';
          } else {
            scope.delayedJobs = data.delayedJobs.length;
          }
        });
        ahDashboardCommunicationService.action('getAllFailedJobs', function (err, data) {
          if(data.errorMessage){
            scope.error = '<div class="callout callout-danger">'+
                           '  <h4>Error:</h4>'+
                           '  <p>'+data.errorMessage+'</p>'+
                           '</div>';
          } else {         
            scope.failedJobs = data.failedJobs.length;
          }
        });
        ahDashboardCommunicationService.action('getTasksStatistics', function (err, data) {
          if(data.errorMessage){
            scope.error = '<div class="callout callout-danger">'+
                           '  <h4>Error:</h4>'+
                           '  <p>'+data.errorMessage+'</p>'+
                           '</div>';
          } else {          
            scope.processedJobs = data.processedJobs;
          }
        });
      }
    };
  });
});