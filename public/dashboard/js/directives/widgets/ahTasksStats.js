define(['app'], function(app){
  app.directive('ahTasksstats', function ($interval) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      template: '<div>'+
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
        $.get('/api/getAllRunningJobs', function (data) {
          scope.runningJobs = data.runningJobs.length;
        });
        $.get('/api/getDelayedJobs', function (data) {
          scope.delayedJobs = data.delayedJobs.length;
        });
        $.get('/api/getAllFailedJobs', function (data) {
          scope.failedJobs = data.failedJobs.length;
        });
        $.get('/api/getTasksStatistics', function (data) {
          scope.processedJobs = data.processedJobs;
        });
      }
    };
  });
});