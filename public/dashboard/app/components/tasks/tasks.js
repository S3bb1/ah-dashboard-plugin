define(['app'], function (app) {
  app.controller('ahDashboardTasks', function ($scope, ahDashboardCommunicationService) {
    $scope.error = '';
    $scope.loadingDone = false;
    function loadResqueStatus(){
      ahDashboardCommunicationService.action('getResqueStatus', function(err, data){
        if(data.errorMessage){
              $scope.error = '<div class="callout callout-danger">'+
                             '  <h4>Error:</h4>'+
                             '  <p>'+data.errorMessage+'</p>'+
                             '</div>';
        } 
        $scope.delayedJobs = [];
        for (var a in data.delayed) {
          var delayedJobsAt = data.delayed[a];
          for(var i=0; i<delayedJobsAt.length; i++){
            var delayedJob = delayedJobsAt[i];
            delayedJob.delayedAt = a;
            $scope.delayedJobs.push(delayedJob);
          }

        }
        $scope.loadingDone = true;

        $scope.runningJobs = [];
        for (var worker in data.details.workers) {
          if(data.details.workers[worker].run_at){
            var runningJob = data.details.workers[worker];
            runningJob.worker = worker;
            $scope.runningJobs.push(runningJob);    
          }
        }

        $scope.failedJobs = [];
        for (var j=0; j<data.failedJobs.length; j++) {
          var failedJob = data.failedJobs[j];
          $scope.failedJobs.push(failedJob);
        }
        $scope.$apply();
      });
    }

    $scope.reloadAllTasks = function () {
      loadResqueStatus();
    };
    $scope.reloadAllTasks();
    $scope.reEnqueueTask = function(taskDefinition){
      delete taskDefinition.failed_at_millis;
      $.ajax({
        type: "POST",
        url: ahDashboardCommunicationService.options.apiPath + '/reEnqueueTask',
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