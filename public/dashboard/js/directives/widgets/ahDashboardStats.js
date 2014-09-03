define(['app'], function (app) {
  app.directive('ahStats', function ($interval) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      template: '<div><div class="chart" id="{{directiveId}}" style="height: 300px;"><div ng-bind-html="error"></div></div> <div ng-click=\"refreshChart();\" class=\"pull-left\">Refresh Chart: <div class=\"glyphicon glyphicon-refresh\"></div></div></div>',
      link: function (scope) {
        scope.directiveId = "chart_stats_" + scope.$id;
        scope.widget.ranges = [
          { value: 'minute', label: 'Last Minute (in seconds)'},
          { value: 'hour', label: 'Last Hour (in minute steps)'},
          { value: 'hour5', label: 'Last Hour (in 5 minute steps)'},
          { value: 'hour10', label: 'Last Hour (in 10 minute steps)'},
          { value: 'day', label: 'Last 24 Hours (in hour steps)'}
        ]
        scope.refreshChart = function () {
          scope.retrieveStats(scope.widget.attrs);
        };

        scope.retrieveStats = function (changes) {
          if (!changes.timerange) {
            changes.timerange = 'hour';
          }
          $.get('/api/getStats?timerange=' + changes.timerange, function (data) {
            scope.error = '';
            if(data.errorMessage){
              scope.error = '<div class="callout callout-danger">'+
                             '  <h4>Error:</h4>'+
                             '  <p>'+data.errorMessage+'</p>'+
                             '</div>';
            } else {
              var result = [];
              var selectedKeys = _.pluck(changes.stats, 'id');
              _.each(data.timeseries, function (value, key) {
                if (_.indexOf(selectedKeys, key) != -1) {
                  for (var index in value) {
                    var resultObj = {y: value[index][2]};
                    resultObj[key] = value[index][1];

                    result[index] = _.extend(resultObj, result[index]);
                  }
                }
              });
              if (scope.chart) {
                scope.chart.options.ykeys = selectedKeys;
                scope.chart.options.labels = selectedKeys;
                scope.chart.setData(result);

              } else {
                // LINE CHART
                scope.chart = new Morris.Line({
                  element: scope.directiveId,
                  resize: true,
                  data: result,
                  xkey: 'y',
                  ykeys: selectedKeys,
                  labels: selectedKeys,
                  hideHover: 'auto',
                  dateFormat: function (x) {
                    return new Date(x).toLocaleString();
                  }
                });
              }
            }
          });
        }

        scope.$watch('widget.attrs', function (changes) {
          scope.retrieveStats(changes);
        }, true);
        scope.widget.dropdownSettings = {displayProp: 'label', idProp: 'label'};
        $.get('/api/getStatsKeys', function (data) {
          var id = 0;
          scope.widget.statsArr = [];
          for (var stat in data.statsKeys) {
            scope.widget.statsArr.push({id: id, label: stat});
            id++;
          }
        });
      }
    };
  });
});