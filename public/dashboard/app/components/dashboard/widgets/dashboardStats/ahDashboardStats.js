define(['app', 
        'components/dashboard/widgets/dashboardStats/ahDashboardStatsTemplate',
        'components/dashboard/widgets/dashboardStats/ahDashboardStats-defaultWidgets-factory'], function (app) {
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
        scope.ranges = [
          { value: 'minute', label: 'Last Minute (in seconds)'},
          { value: 'hour', label: 'Last Hour (in minute steps)'},
          { value: 'hour5', label: 'Last Hour (in 5 minute steps)'},
          { value: 'hour10', label: 'Last Hour (in 10 minute steps)'},
          { value: 'day', label: 'Last 24 Hours (in hour steps)'}
        ];
        scope.currentConfig = {};
        scope.refreshChart = function () {
          scope.retrieveStats();
        };

        scope.retrieveStats = function () {
          if (!scope.currentConfig.timerange) {
            scope.currentConfig.timerange = 'hour';
          }
          if(!scope.currentConfig.selectedKeys){
            scope.currentConfig.selectedKeys = [];
          }
          $.get('/api/getStats?timerange=' + scope.currentConfig.timerange, function (data) {
            scope.error = '';
            if(data.errorMessage){
              scope.error = '<div class="callout callout-danger">'+
                             '  <h4>Error:</h4>'+
                             '  <p>'+data.errorMessage+'</p>'+
                             '</div>';
            } else {
              var result = [];
              _.each(data.timeseries, function (value, key) {
                if (_.indexOf(scope.currentConfig.selectedKeys, key) != -1) {
                  for (var index in value) {
                    var resultObj = {y: value[index][2]};
                    resultObj[key] = value[index][1];

                    result[index] = _.extend(resultObj, result[index]);
                  }
                }
              });
              if (scope.chart) {
                scope.chart.options.ykeys = scope.currentConfig.selectedKeys;
                scope.chart.options.labels = scope.currentConfig.selectedKeys;
                scope.chart.setData(result);

              } else {
                // LINE CHART
                scope.chart = new Morris.Line({
                  element: scope.directiveId,
                  resize: true,
                  data: result,
                  xkey: 'y',
                  ykeys: scope.currentConfig.selectedKeys,
                  labels: scope.currentConfig.selectedKeys,
                  hideHover: 'auto',
                  dateFormat: function (x) {
                    return new Date(x).toLocaleString();
                  }
                });
              }
            }
          });
        }

        scope.open = function (size) {

          var modalInstance = $modal.open({
            templateUrl: 'template/widget-settings-stats-template.html',
            controller: 'WidgetConfigController',
            resolve: {
              config: function () {
                return {
                  statsArr:scope.statsArr,
                  stats:scope.currentConfig.stats,
                  ranges: scope.ranges,
                  timerange: scope.currentConfig.timerange
                }
              }
            }
          });

          modalInstance.result.then(function (config) {
            console.dir(config);
            scope.currentConfig.timerange = config.timerange;
            scope.currentConfig.selectedKeys = _.pluck(config.stats, 'id');
            scope.currentConfig.stats = config.stats;
            scope.retrieveStats();
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
        };

        scope.dropdownSettings = {displayProp: 'label', idProp: 'label'};
        $.get('/api/getStatsKeys', function (data) {
          var id = 0;
          scope.statsArr = [];
          var tempLabels = [];
          var tempIds = [];
          for (var stat in data.statsKeys) {
            scope.statsArr.push({id: id, label: data.statsKeys[stat]});
            tempLabels.push({id: data.statsKeys[stat]});
            tempIds.push(data.statsKeys[stat]);
            id++;
          }
          if(scope.stats.length == 0){
            scope.stats = tempLabels;
          }
          scope.currentConfig.selectedKeys = tempIds;
          scope.currentConfig.stats = tempLabels;
          scope.retrieveStats();
        });
      }
    };
  });
});