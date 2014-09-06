define(['app'], function(app){
  app.directive('ahTasksstats', function ($interval) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      template: '<div>'+
                  '<div ng-bind-html="error"></div>'+
                  '<ul class="list-group">'+
                    '<a href="#/tasks" class="list-group-item list-group-item-warning">Running Jobs<span class="badge">{{runningJobs}}</span></a>'+
                    '<a href="#/tasks" class="list-group-item list-group-item-info">Delayed Jobs<span class="badge">{{delayedJobs}}</span></a>'+
                    '<a href="#/tasks" class="list-group-item list-group-item-danger">Failed Jobs<span class="badge">{{failedJobs}}</span></a>'+
                  '</ul>'+
                  '<ul class="list-group">'+
                    '<li class="list-group-item" ng-repeat="(workerName, taskCount) in processedJobs">{{workerName}}<span class="badge">{{taskCount}}</span></li>'+
                  '</ul>'+
                '</div>',
      link: function (scope) {
        scope.error = '';
        $.get('/api/getAllRunningJobs', function (data) {
          if(data.errorMessage){
            scope.error = '<div class="callout callout-danger">'+
                           '  <h4>Error:</h4>'+
                           '  <p>'+data.errorMessage+'</p>'+
                           '</div>';
          } else {
            scope.runningJobs = data.runningJobs.length;
          }
        });
        $.get('/api/getDelayedJobs', function (data) {
          if(data.errorMessage){
            scope.error = '<div class="callout callout-danger">'+
                           '  <h4>Error:</h4>'+
                           '  <p>'+data.errorMessage+'</p>'+
                           '</div>';
          } else {
            scope.delayedJobs = data.delayedJobs.length;
          }
        });
        $.get('/api/getAllFailedJobs', function (data) {
          if(data.errorMessage){
            scope.error = '<div class="callout callout-danger">'+
                           '  <h4>Error:</h4>'+
                           '  <p>'+data.errorMessage+'</p>'+
                           '</div>';
          } else {         
            scope.failedJobs = data.failedJobs.length;
          }
        });
        $.get('/api/getTasksStatistics', function (data) {
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