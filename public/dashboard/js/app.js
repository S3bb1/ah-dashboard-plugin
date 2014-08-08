define([
  'angular',
  'angular-route',
  'angular-dashboard',
  'angular-multiselect',
  'angular-markdown',
  'angular-sanitize',
  'angular-ui-sortable',
  'angular-bootstrap',
  'angular-dashboard'
], function (angular) {

  var app = angular.module('app', [
    'ngRoute',
    'ui.dashboard',
    'btford.markdown',
    'angularjs-dropdown-multiselect',
  ]);
  app.init = function () {
    angular.bootstrap(document, ['app']);
  };

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'ahDashboard',
        title: 'simple',
        description: 'This is the simplest demo.'
      })
      .when('/actions', {
        templateUrl: 'views/actions.html',
        controller: 'ahDashboardActions'
      })
      .when('/logging', {
        templateUrl: 'views/logging.html',
        controller: 'ahDashboardLogging'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  app.factory('widgetDefinitions', function (RandomDataModel) {
      return [
        {
          name: 'time',
          directive: 'wt-time',
          title: 'Current Time',
          style: {
            width: '300px'
          }
        },
        {
          name: 'stats',
          title: 'ActionHero Stats Statistics',
          directive: 'ah-stats',
          settingsModalOptions: {
            templateUrl: 'template/widget-settings-stats-template.html',
            controller: 'WidgetSettingsCtrl'
          },
          onSettingsClose: function (result, widget) {
            jQuery.extend(true, widget, result);
            widget.attrs.stats = result.attrs.stats;
          },
          attrs: {
            stats: []
          },
          style: {
            width: '100%'
          }
        },
        {
          name: 'cpuusage',
          title: 'ActionHero CPU Usage',
          directive: 'ah-cpuusage'
        }
      ];
    })
    .value('defaultWidgets', [
      { name: 'stats', title: 'ActionHero Stats Statistics', style: {
        width: '100%'
      } },
      { name: 'cpuusage', style: {
        width: '300px'
      } },
      { name: 'time'}
    ])

    .directive('ahStats', function ($interval) {
      return {
        restrict: 'A',
        scope: true,
        replace: true,
        template: '<div><div class="chart" id="{{directiveId}}" style="height: 300px;"></div> <div ng-click=\"refreshChart();\" class=\"pull-left\">Refresh Chart: <div class=\"glyphicon glyphicon-refresh\"></div></div></div>',
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
            $.get('/api/getStats?timerange=' + changes.timerange + '&key=bla', function (data) {
              var result = [];
              var selectedKeys = _.pluck(changes.stats, 'id');
              if (selectedKeys.length > 0) {
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
    })
    .directive('wtTime', function ($interval) {
      return {
        restrict: 'A',
        scope: true,
        replace: true,
        template: '<div><h3>{{time}}</h3></div>',
        link: function (scope) {
          function update() {
            scope.time = new Date().toLocaleString();
          }

          update();

          var promise = $interval(update, 500);

          scope.$on('$destroy', function () {
            $interval.cancel(promise);
          });
        }
      };
    })
    .directive('ahCpuusage', function ($interval) {
      return {
        restrict: 'A',
        scope: true,
        replace: true,
        template: '<div><input type="text" class="knob" value="" data-width="80" data-height="90" data-readOnly="true" data-fgColor="#39CCCC"/><div class="knob-label">CPU</div></div>',
        link: function (scope) {
          $(".knob").knob({inline: false});
          function update() {
            $.get('/api/getCPUusage', function (data) {
              $('.knob')
                .val(data.cpuusage * 100)
                .trigger('change');

            });
          }

          update();

          var promise = $interval(update, 10000);

          scope.$on('$destroy', function () {
            $interval.cancel(promise);
          });
        }
      };
    })
    .directive('wtScopeWatch', function () {
      return {
        restrict: 'A',
        replace: true,
        template: '<div>Value<div class="alert alert-info">{{value}}</div></div>',
        scope: {
          value: '=value'
        }
      };
    })
    .factory('RandomDataModel', function ($interval, WidgetDataModel) {
      function RandomDataModel() {
      }

      RandomDataModel.prototype = Object.create(WidgetDataModel.prototype);
      RandomDataModel.prototype.constructor = WidgetDataModel;

      angular.extend(RandomDataModel.prototype, {
        init: function () {
          this.updateScope('-');
          this.intervalPromise = $interval(function () {
            var value = Math.floor(Math.random() * 100);
            this.updateScope(value);
          }.bind(this), 500);
        },

        destroy: function () {
          WidgetDataModel.prototype.destroy.call(this);
          $interval.cancel(this.intervalPromise);
        }
      });

      return RandomDataModel;
    }).run(function ($templateCache) {
      $templateCache.put("template/widget-settings-stats-template.html",
          "<div class=\"modal-header\">\n" +
          "    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"cancel()\">&times;</button>\n" +
          "  <h3>Widget Options for <small>{{widget.title}}</small></h3>\n" +
          "</div>\n" +
          "\n" +
          "<div class=\"modal-body\">\n" +
          "    <form name=\"form\" novalidate class=\"form-horizontal\">\n" +
          "        <div class=\"form-group\">\n" +
          "            <label for=\"widgetTitle\" class=\"col-sm-3 control-label\">Title</label>\n" +
          "            <div class=\"col-sm-9\">\n" +
          "                <input type=\"text\" class=\"form-control\" name=\"widgetTitle\" ng-model=\"result.title\">\n" +
          "            </div>\n" +
          "        </div>\n" +
          "        <div class=\"form-group\">\n" +
          "            <label for=\"widgetStats\" class=\"col-sm-3 control-label\">Stats</label>\n" +
          "            <div class=\"col-sm-9\">\n" +
          "                <div ng-dropdown-multiselect=\"\" options=\"result.statsArr\" selected-model=\"result.attrs.stats\" extra-settings=\"result.dropdownSettings\"></div>" +
          "            </div>\n" +
          "        </div>\n" +
          "        <div class=\"form-group\">\n" +
          "            <label for=\"widgetStatsRange\" class=\"col-sm-3 control-label\">Time Range</label>\n" +
          "            <div class=\"col-sm-9\">\n" +
          "                <select class=\"form-control\" ng-model=\"result.attrs.timerange\" name=\"widgetStatsRange\" ng-options=\"range.value as range.label for range in result.ranges\"></select>" +
          "            </div>\n" +
          "        </div>\n" +
          "        <div ng-include=\"optionsTemplateUrl\"></div>\n" +
          "    </form>\n" +
          "</div>\n" +
          "\n" +
          "<div class=\"modal-footer\">\n" +
          "    <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
          "    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"ok()\">OK</button>\n" +
          "</div>"
      );
      $templateCache.put("template/ah-dashboard.html",
          "<div>\n" +
          "    <div class=\"btn-toolbar\" ng-if=\"!options.hideToolbar\">\n" +
          "        <div class=\"btn-group\" ng-if=\"!options.widgetButtons\">\n" +
          "            <button type=\"button\" class=\"dropdown-toggle btn btn-primary\" data-toggle=\"dropdown\">Add Widget <span\n" +
          "                    class=\"caret\"></span></button>\n" +
          "            <ul class=\"dropdown-menu\" role=\"menu\">\n" +
          "                <li ng-repeat=\"widget in widgetDefs\">\n" +
          "                    <a href=\"#\" ng-click=\"addWidgetInternal($event, widget);\"><span class=\"label label-primary\">{{widget.name}}</span></a>\n" +
          "                </li>\n" +
          "            </ul>\n" +
          "        </div>\n" +
          "\n" +
          "        <div class=\"btn-group\" ng-if=\"options.widgetButtons\">\n" +
          "            <button ng-repeat=\"widget in widgetDefs\"\n" +
          "                    ng-click=\"addWidgetInternal($event, widget);\" type=\"button\" class=\"btn btn-primary\">\n" +
          "                {{widget.name}}\n" +
          "            </button>\n" +
          "        </div>\n" +
          "\n" +
          "        <button class=\"btn btn-warning\" ng-click=\"resetWidgetsToDefault()\">Default Widgets</button>\n" +
          "\n" +
          "        <button ng-if=\"options.storage && options.explicitSave\" ng-click=\"options.saveDashboard()\" class=\"btn btn-success\" ng-disabled=\"!options.unsavedChangeCount\">{{ !options.unsavedChangeCount ? \"all saved\" : \"save changes (\" + options.unsavedChangeCount + \")\" }}</button>\n" +
          "\n" +
          "        <button ng-click=\"clear();\" type=\"button\" class=\"btn btn-info\">Clear</button>\n" +
          "    </div>\n" +
          "\n" +
          "    <div ui-sortable=\"sortableOptions\" ng-model=\"widgets\" class=\"dashboard-widget-area\">\n" +
          "        <div ng-repeat=\"widget in widgets\" ng-style=\"widget.style\" class=\"widget-container\" widget>\n" +
          "            <div class=\"widget box box-info\">\n" +
          "                <div class=\"box-header\">\n" +
          "                    <h3 class=\"box-title\">\n" +
          "                        <span class=\"widget-title\" ng-dblclick=\"editTitle(widget)\" ng-hide=\"widget.editingTitle\">{{widget.title}}</span>\n" +
          "                        <form action=\"\" class=\"widget-title\" ng-show=\"widget.editingTitle\" ng-submit=\"saveTitleEdit(widget)\">\n" +
          "                            <input type=\"text\" ng-model=\"widget.title\" class=\"form-control\">\n" +
          "                        </form>\n" +
          "                        <span class=\"label label-primary\" ng-if=\"!options.hideWidgetName\">{{widget.name}}</span>\n" +
          "                    </h3>\n" +
          "                    <div class=\"box-tools pull-right\">" +
          "                      <div ng-click=\"removeWidget(widget);\" class=\"label bg-aqua maploc\"></div>" +
          "                    </div>" +
          "                </div>\n" +
          "                <div class=\"panel-body box-body widget-content\"></div>\n" +
          "                <div class=\"box-footer\">" +
          "                  <a href=\"\" ng-click=\"openWidgetSettings(widget);\">Change Settings</a>" +
          "                </div>" +
          "                <div class=\"widget-ew-resizer\" ng-mousedown=\"grabResizer($event)\"></div>\n" +
          "            </div>\n" +
          "        </div>\n" +
          "    </div>\n" +
          "</div>"
      );
    });
  return app;
});