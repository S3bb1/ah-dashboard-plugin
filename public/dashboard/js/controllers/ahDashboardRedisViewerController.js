define(['app'], function (app) {
  app.controller('ahDashboardRedisViewer', function ($scope) {
    $scope.details = {};
    $("#redisKeys").fancytree({
      extensions: ['contextMenu'],
      contextMenu: {
        menu: {
          'reload': { 'name': 'Refresh', 'icon': 'edit' },
        },
        actions: function(node, action, options) {
          node.load();
        }
      },
      imagePath: "img/",
      source: {
        url: "/api/getAllRedisKeys"
      },
      postProcess: function(event, data){
        data.result = data.response.redisKeys
      },
      lazyLoad: function(event, data){
        var keyPath = data.node.getKeyPath();
        if(keyPath[0] == '/'){
          keyPath = keyPath.substr(1);
        }
        keyPath = keyPath.replace(/\//g, ':');
        data.result = {url: "/api/getAllRedisKeys?prefix="+encodeURIComponent(keyPath)}
      },
      click: function(event, data) {
        var node = data.node;
        var keyPath = node.getKeyPath();
        if(keyPath[0] == '/'){
          keyPath = keyPath.substr(1);
        }
        keyPath = keyPath.replace(/\//g, ':');
        $.ajax({
          url: "/api/getRedisKeyValue?key="+encodeURIComponent(keyPath),
        }).done(function(response) {
          $scope.details = response.details;
          $scope.$apply();
        });
      },
    });
  });
  app.directive('contentItem', function ($compile) {
    var hashTemplate = '<table class="table">'+
                       '   <thead>'+
                       '       <tr>'+
                       '           <th>Field</th>'+
                       '           <th>Value</th>'+
                       '       </tr>'+
                       '   </thead>'+
                       '   <tbody>'+
                       '       <tr ng-repeat="(key, value) in content.data">'+
                       '           <td>{{key}}</td>'+
                       '           <td>{{value}}</td>'+
                       '       </tr>'+
                       '   </tbody>'+
                       '</table>';
    var listTemplate = '<table class="table">'+
                       '   <thead>'+
                       '    <th>#</th>'+
                       '    <th>Value</th>'+
                       '  </thead>'+
                       '  <tbody>'+
                       '    <tr ng-repeat="item in content.data">'+
                       '      <td>{{item.number}}</td>'+
                       '      <td>{{item.value}}</td>'+
                       '    </tr>'+
                       '  </tbody>'+
                       '</table>';
    var zSetTemplate = '<table class="table">'+
                       '   <thead>'+
                       '    <th>#</th>'+
                       '    <th>Score</th>'+
                       '    <th>Value</th>'+
                       '  </thead>'+
                       '  <tbody>'+
                       '    <tr ng-repeat="item in content.items">'+
                       '      <td>{{item.number}}</td>'+
                       '      <td>{{item.score}}</td>'+
                       '      <td>{{item.value}}</td>'+
                       '    </tr>'+
                       '  </tbody>'+
                       '</table>';                       
    var setTemplate =  '<table class="table">'+
                       '   <thead>'+
                       '    <th>Member</th>'+
                       '  </thead>'+
                       '  <tbody>'+
                       '    <tr ng-repeat="item in content.members">'+
                       '      <td>{{item}}</td>'+
                       '    </tr>'+
                       '  </tbody>'+
                       '</table>';  

    var strTemplate =  '<form class="form-horizontal" role="form">'+
                       '   <div class="form-group">'+
                       '     <label for="key" class="col-sm-2 control-label">Key</label>'+
                       '     <div class="col-sm-10">'+
                       '       <input type="text" disabled="disabled" class="form-control" id="key" value="{{content.key}}" placeholder="Key">'+
                       '     </div>'+
                       '   </div>'+
                       '   <div class="form-group">'+
                       '     <label for="value" class="col-sm-2 control-label">Value</label>'+
                       '     <div class="col-sm-10">'+
                       '       <textarea class="form-control" id="value">{{content.value}}</textarea>'+
                       '     </div>'+
                       '   </div>'+
                       ' </form>';  

    var getTemplate = function(contentType) {
        var template = '';

        switch(contentType) {
            case 'hash':
                template = hashTemplate;
                break;
            case 'list':
                template = listTemplate;
                break;
            case 'set':
                template = setTemplate;
                break;     
            case 'zset':
                template = zSetTemplate;
                break;
            case 'string':
                template = strTemplate;
                break;                
        }

        return template;
    }

    var linker = function(scope, element, attrs) {
        scope.rootDirectory = 'images/';
        scope.$watch('content',function(values) {
          element.html(getTemplate(scope.content.type)).show();
          $compile(element.contents())(scope);
        }, true);
    }

    return {
        restrict: "E",
        rep1ace: true,
        link: linker,
        scope: {
            content:'='
        }
    };
  });
});