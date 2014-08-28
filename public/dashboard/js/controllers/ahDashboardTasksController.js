define(['app'], function (app) {
  app.controller('ahDashboardTasks', function ($scope) {
    function loadRunningTasks() {
      $scope.runningJobsLoadingDone = false;
      $.get('/api/getAllRunningJobs', function (data) {
        $scope.runningJobs = [];
        for (var runningJob in data.runningJobs) {
          $scope.runningJobs.push(data.runningJobs[runningJob]);
        }
        $scope.runningJobsLoadingDone = true;
      });
    }
    loadRunningTasks();
    $scope.reloadRunningTasks = function () {
      loadRunningTasks();
    };
    function loadDelayedTasks(){
      $scope.delayedJobsLoadingDone = false;
      $.get('/api/getDelayedJobs', function (data) {
        $scope.delayedJobs = [];
        for (var delayedJob in data.delayedJobs) {
          $scope.delayedJobs.push(data.delayedJobs[delayedJob]);
        }
        $scope.delayedJobsLoadingDone = true;
      });
    };
    loadDelayedTasks();
    $scope.reloadDelayedTasks = function () {
      loadDelayedTasks();
    };
    function loadFailedTasks(){
      $scope.failedTasksLoadingDone = false;
      $.get('/api/getAllFailedJobs', function (data) {
        $scope.failedJobs = [];
        for (var failedJob in data.failedJobs) {
          $scope.failedJobs.push(data.failedJobs[failedJob]);
        }
        $scope.failedTasksLoadingDone = true;
      });
    };
    loadFailedTasks();
    $scope.reloadFailedTasks = function () {
      loadFailedTasks();
    };
  });
});