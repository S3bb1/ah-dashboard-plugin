require.config({
  paths: {
    'angular' : '../bower_components/angular/angular',
    'angular-route' : '../bower_components/angular-route/angular-route',
    'angular-bootstrap' : '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
    'angular-ui-sortable' : '../bower_components/angular-ui-sortable/sortable',
    'angular-sanitize' : '../bower_components/angular-sanitize/angular-sanitize',
    'angular-markdown' : '../bower_components/angular-markdown-directive/markdown',
    'angular-multiselect' : '../bower_components/angularjs-dropdown-multiselect/src/angularjs-dropdown-multiselect',
    'lodash' : '../bower_components/lodash/dist/lodash',
    'jquery' : '../bower_components/jquery/dist/jquery.min',
    'bootstrap' : '../bower_components/bootstrap/dist/js/bootstrap.min',
    'jquery-ui' : '../bower_components/jquery-ui/jquery-ui',
    'jquery-knob' : '../bower_components/jquery-knob/dist/jquery.knob.min',
    'morris' : '../bower_components/morrisjs/morris',
    'raphael' : '../bower_components/raphael/raphael-min',
    'AHclient' : '/public/javascript/actionheroClient',
    'angular-dashboard' : 'angular-ui-dashboard'


  },
  shim: {
    'angular-route': {
      deps: ['angular'],
      exports: 'angular'
    },
    'angular-bootstrap': {
      deps: ['angular'],
      exports: 'angular'
    },
    'angular-sanitize': {
      deps: ['angular'],
      exports: 'angular'
    },
    'angular-markdown': {
      deps: ['angular'],
      exports: 'angular'
    },
    'angular-multiselect': {
      deps: ['angular'],
      exports: 'angular'
    },
    'angular-ui-sortable': {
      deps: ['angular'],
      exports: 'angular'
    },
    'jquery-knob': {
      deps: ['jquery']
    },
    'morris': {
      deps: ['jquery']
    },
    angular: {
      exports : 'angular'
    }
  }
});

require(['app', 'jquery', 'jquery-ui', 'jquery-knob', 'morris', 'lodash', 'AHclient', 'raphael'], function (app) {
  app.init();
});