define(['app'], function (app) {
  app.factory('widgetDefinitions', function () {
    return [
      {
        name: 'time',
        displayName : 'Current Time',
        directive: 'ah-time',
        title: 'Current Time',
        style: {
          width: '300px'
        }
      },
      {
        name: 'stats',
        displayName : 'Statistics',
        title: 'Stats Statistics',
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
        displayName : 'CPU Usage',
        title: 'CPU Usage',
        directive: 'ah-cpuusage',
        style: {
          width: '300px'
        }
      },
      {
        name: 'taskstats',
        displayName : 'Tasks Stats',
        title: 'Tasks Stats',
        directive: 'ah-tasksstats',
        style: {
          width: '300px'
        }
      },
      {
        name: 'ramusage',
        displayName : 'RAM Usage',
        title: 'RAM Usage',
        directive: 'ah-ramusage',
        style: {
          width: '300px'
        }
      },
      {
        name: 'uptime',
        displayName : 'AH Uptime',
        title: 'Uptime',
        directive: 'ah-uptime',
        style: {
          width: '300px'
        }
      }
    ];
  })
  .value('defaultWidgets', [
    { name: 'stats' },
    { name: 'cpuusage' },
    { name: 'ramusage' },
    { name: 'uptime' },
    { name: 'time'},
    { name: 'taskstats'}
  ]);
});