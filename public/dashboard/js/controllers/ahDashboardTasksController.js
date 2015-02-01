define(['app'], function (app) {
  app.controller('ahDashboardTasks', function ($scope) {
    $scope.error = '';
    function loadRunningTasks() {
      $scope.runningJobsLoadingDone = false;
      $.get('/api/getAllRunningJobs', function (data) {
        if(data.errorMessage){
              $scope.error = '<div class="callout callout-danger">'+
                             '  <h4>Error:</h4>'+
                             '  <p>'+data.errorMessage+'</p>'+
                             '</div>';
        } 
        $scope.runningJobs = [];
        for (var runningJob in data.runningJobs) {
          $scope.runningJobs.push(data.runningJobs[runningJob]);
        }
        $scope.runningJobsLoadingDone = true;
        $scope.$apply();
      });
    }
    loadRunningTasks();
    $scope.reloadRunningTasks = function () {
      loadRunningTasks();
    };
    function loadDelayedTasks(){
      $scope.delayedJobsLoadingDone = false;
      $.get('/api/getDelayedJobs', function (data) {
        if(data.errorMessage){
              $scope.error = '<div class="callout callout-danger">'+
                             '  <h4>Error:</h4>'+
                             '  <p>'+data.errorMessage+'</p>'+
                             '</div>';
        } 
        $scope.delayedJobs = [];
        for (var delayedJob in data.delayedJobs) {
          $scope.delayedJobs.push(data.delayedJobs[delayedJob]);
        }
        $scope.delayedJobsLoadingDone = true;
        $scope.$apply();
      });
    };
    loadDelayedTasks();
    $scope.reloadDelayedTasks = function () {
      loadDelayedTasks();
    };
    $scope.reloadAllTasks = function () {
      $scope.reloadDelayedTasks();
      $scope.reloadFailedTasks();
      $scope.reloadRunningTasks();
    };
    function loadFailedTasks(){
      $scope.failedTasksLoadingDone = false;
      $.get('/api/getAllFailedJobs', function (data) {
        if(data.errorMessage){
              $scope.error = '<div class="callout callout-danger">'+
                             '  <h4>Error:</h4>'+
                             '  <p>'+data.errorMessage+'</p>'+
                             '</div>';
        } 
        $scope.failedJobs = [];
        for (var failedJob in data.failedJobs) {
          var tempFailedJob = JSON.parse(data.failedJobs[failedJob]);
          tempFailedJob.plain = data.failedJobs[failedJob];
          tempFailedJob.failed_at = new Date(Date.parse(tempFailedJob.failed_at)).getTime();
          $scope.failedJobs.push(tempFailedJob);
        }
        $scope.failedTasksLoadingDone = true;
        $scope.$apply();
      });
    };
    loadFailedTasks();
    $scope.reloadFailedTasks = function () {
      loadFailedTasks();
    };

    $scope.reEnqueueTask = function(taskDefinition){
      delete taskDefinition.failed_at_millis;
      $.ajax({
        type: "POST",
        url: '/api/reEnqueueTask',
        data:  JSON.stringify({taskdefinition: taskDefinition.plain}),
        success:  function (data) {
        },
        contentType: 'application/json'
      });
    };


    /*     
     * Add collapse and remove events to boxes
     */
    $("[data-widget='collapse']").click(function() {
        //Find the box parent        
        var box = $(this).parents(".box").first();
        //Find the body and the footer
        var bf = box.find(".box-body, .box-footer");
        if (!box.hasClass("collapsed-box")) {
            box.addClass("collapsed-box");
            //Convert minus into plus
            $(this).children(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
            bf.slideUp();
        } else {
            box.removeClass("collapsed-box");
            //Convert plus into minus
            $(this).children(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
            bf.slideDown();
        }
    });
  });
});