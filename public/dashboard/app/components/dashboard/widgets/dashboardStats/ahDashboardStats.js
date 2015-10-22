define(['app'], function (app) {
  app.controller('WidgetConfigController', function($scope, $modalInstance, config){
    $scope.config = config;
    $scope.dropdownSettings = {displayProp: 'label', idProp: 'label'};
    $scope.ok = function () {
      $modalInstance.close($scope.config);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
  app.directive('ahStats', function ($interval, $modal) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      templateUrl: 'app/components/dashboard/widgets/dashboardStats/ahDashboardStatsTemplate.html',
      link: function (scope) {
        scope.directiveId = "chart_stats_" + scope.$id;
        scope.stats = [];

        // config for timerange and keys
        scope.currentConfig = {};
        scope.currentConfig.ranges = [
          { value: 'minute', label: 'Last Minute (in seconds)'},
          { value: 'hour', label: 'Last Hour (in minute steps)'},
          { value: 'hour5', label: 'Last Hour (in 5 minute steps)'},
          { value: 'hour10', label: 'Last Hour (in 10 minute steps)'},
          { value: 'day', label: 'Last 24 Hours (in hour steps)'}
        ];
        scope.currentConfig.timerange = 'hour';
        scope.currentConfig.selectedKeys = [];
        scope.currentConfig.availableKeys = [];

        // get all keys from actionhero
        $.get('/api/getStatsKeys', function (data) {
          for(var a in data.statsKeys){
            scope.currentConfig.availableKeys.push({id:[a], label:data.statsKeys[a]});
            scope.currentConfig.selectedKeys.push({id:data.statsKeys[a]});
          }

          scope.retrieveStats();
        });    
        
        /**
         * toggle the streaming of stats 
         */
        scope.toggleStreaming = function(){
          if(!scope.streamingActive){
            scope.streamingActive = true;
            scope.streamInterval = $interval(scope.retrieveStats, 1000);
          } else {
            scope.streamingActive = false;
            $interval.cancel(scope.streamInterval);
            scope.streamInterval = undefined;
          }
        };

        /**
         * get the current stats for the configured timerage
         */
        scope.retrieveStats = function () {

          // get the current stats for the timerange
          $.get('/api/getStats?timerange=' + scope.currentConfig.timerange, function (data) {
            scope.error = '';
            // display error message if something is wrong
            if(data.errorMessage){
              scope.error = '<div class="callout callout-danger">'+
                             '  <h4>Error:</h4>'+
                             '  <p>'+data.errorMessage+'</p>'+
                             '</div>';
            } else {

              // otherwise parse the timeseries of the retrieved stats
              var result = [];
              var keyIds = _.pluck(scope.currentConfig.selectedKeys, 'id');
              _.each(data.timeseries, function (value, key) {
                if (_.indexOf(keyIds, key) != -1) {
                  for (var index in value) {
                    var resultObj = {y: value[index][2]};
                    resultObj[key] = value[index][1];

                    result[index] = _.extend(resultObj, result[index]);
                  }
                }
              });

              // if the chart is already rendered, update only the keys and values
              if (scope.chart) {
                scope.chart.options.ykeys = keyIds;
                scope.chart.options.labels = keyIds;
                scope.chart.setData(result);

              } else {
                // otherwise render a whole new chart
                scope.chart = new Morris.Line({
                  element: scope.directiveId,
                  resize: true,
                  data: result,
                  xkey: 'y',
                  ykeys: keyIds,
                  labels: keyIds,
                  hideHover: 'auto',
                  dateFormat: function (x) {
                    return new Date(x).toLocaleString();
                  }
                });
              }
            }
          });
        };


        /**
         * open the config modal dialog
         */
        scope.open = function () {

          var modalInstance = $modal.open({
            templateUrl: 'app/components/dashboard/widgets/dashboardStats/ahDashboardStatsTemplate_modal.html',
            controller: 'WidgetConfigController',
            resolve: {
              config: function () {
                return scope.currentConfig;
              }
            }
          });

          modalInstance.result.then(function (config) {
            scope.currentConfig = config;
            scope.retrieveStats();
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
        };


      }
    };
  });
});