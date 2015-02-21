define(['app'], function (app) {
  app.controller('ahDashboardRedisViewer', function ($scope, $rootScope, $modal, ahDashboardCommunicationService) {
    $scope.details = {};
    $scope.redisDetailsLoadingDone = true;
    $("#redisKeys").fancytree({
      extensions: ['contextMenu'],
      contextMenu: {
        menu: {
          'reload': { 'name': 'Refresh', 'icon': 'copy' },
          'createKey': { 'name': 'Create Key', 'icon': 'add' }
        },
        actions: function(node, action, options) {
          if(action === 'createKey'){
            $scope.createNewKey(node);
          } else if(action === 'reload') {
            node.load();
          }
        }
      },
      imagePath: "assets/img/",
      source: {
        url: ahDashboardCommunicationService.ahClient.options.apiPath + "/getAllRedisKeys"
      },
      postProcess: function(event, data){
        data.result = data.response.redisKeys;
      },
      lazyLoad: function(event, data){
        var keyPath = data.node.getKeyPath();
        if(keyPath[0] == '/'){
          keyPath = keyPath.substr(1);
        }
        keyPath = keyPath.replace(/\//g, ':');
        data.result = {url: ahDashboardCommunicationService.ahClient.options.apiPath + "/getAllRedisKeys?prefix="+encodeURIComponent(keyPath)};
      },
      click: function(event, data) {
        $scope.redisDetailsLoadingDone = false;
        var node = data.node;
        var keyPath = node.getKeyPath();
        if(keyPath[0] == '/'){
          keyPath = keyPath.substr(1);
        }
        keyPath = keyPath.replace(/\//g, ':');
        var params = {'key': keyPath};
        ahDashboardCommunicationService.action('getRedisKeyValue', params, function(err, response){
          $scope.redisDetailsLoadingDone = true;
          $scope.details = {keypath:keyPath, details:response.details};
              
          $scope.$apply();
        });
      },
    });

    $scope.createNewKey = function(node){
      var keyPath = node.getKeyPath();
      if(keyPath[0] == '/'){
        keyPath = keyPath.substr(1);
      }
      keyPath = keyPath.replace(/\//g, ':');
      keyPath = keyPath + ':';
      var modalInstance = $modal.open({
        templateUrl: 'modalRedisCreateKey.html',
        controller: 'ahDashboardRedisModalController',
        resolve: {
          element: function () {
            return {node:node, key:keyPath};
          },
          newItem: function (){
            return false;
          }
        }
      });

      modalInstance.result.then(function (element) {
        var params = {'key': element.key,
                      'type': element.type};
        ahDashboardCommunicationService.action('addRedisKey', params, function(){
          element.node.tree.reload();
        });
      }, function () {
        // Cancel clicked
      });
    };
  });
  app.directive('contentItem', function ($compile, $rootScope, $modal, ahDashboardCommunicationService) {
    var hashTemplate = '<button ng-click="addUpdateHashItem()" class="btn btn-default">Add Element</button>'+
                       '<table class="table">'+
                       '   <thead>'+
                       '       <tr>'+
                       '           <th>Field</th>'+
                       '           <th>Value</th>'+
                       '           <th>Edit/Remove</th>'+
                       '       </tr>'+
                       '   </thead>'+
                       '   <tbody>'+
                       '       <tr ng-repeat="(key, value) in content.details.data">'+
                       '           <td>{{key}}</td>'+
                       '           <td>{{value}}</td>'+
                       '           <td>'+
                       '             <button ng-click="addUpdateHashItem(key, value)" type="button" class="btn btn-success btn-xs">'+
                       '               <span class="glyphicon glyphicon-pencil"></span>'+
                       '             </button>'+
                       '             <button ng-click="removeHashItem(key)" type="button" class="btn btn-danger btn-xs">'+
                       '               <span class="glyphicon glyphicon-remove"></span>'+
                       '             </button>'+
                       '           </td>'+                       
                       '       </tr>'+
                       '   </tbody>'+
                       '</table>';
    var listTemplate = '<button ng-click="addUpdateListItem()" class="btn btn-default">Add Element</button>'+
                       '<table class="table">'+
                       '   <thead>'+
                       '    <th>#</th>'+
                       '    <th>Value</th>'+
                       '    <th>Edit/Remove</th>'+
                       '  </thead>'+
                       '  <tbody>'+
                       '    <tr ng-repeat="item in content.details.items">'+
                       '      <td>{{item.number}}</td>'+
                       '      <td>{{item.value}}</td>'+
                       '      <td>'+
                       '        <button ng-click="addUpdateListItem(item.number, item.value)" type="button" class="btn btn-success btn-xs">'+
                       '          <span class="glyphicon glyphicon-pencil"></span>'+
                       '        </button>'+
                       '        <button ng-click="removeListItem(item.value)" type="button" class="btn btn-danger btn-xs">'+
                       '          <span class="glyphicon glyphicon-remove"></span>'+
                       '        </button>'+
                       '      </td>'+
                       '    </tr>'+
                       '  </tbody>'+
                       '</table>';
    var zSetTemplate = '<button ng-click="addUpdateZSetItem()" class="btn btn-default">Add Element</button>'+
                       '<table class="table">'+
                       '   <thead>'+
                       '    <th>#</th>'+
                       '    <th>Score</th>'+
                       '    <th>Value</th>'+
                       '    <th>Edit/Remove</th>'+
                       '  </thead>'+
                       '  <tbody>'+
                       '    <tr ng-repeat="item in content.details.items">'+
                       '      <td>{{item.number}}</td>'+
                       '      <td>{{item.score}}</td>'+
                       '      <td>{{item.value}}</td>'+
                       '      <td>'+
                       '        <button type="button" ng-click="addUpdateZSetItem(item.score, item.value)" class="btn btn-success btn-xs">'+
                       '          <span class="glyphicon glyphicon-pencil"></span>'+
                       '        </button>'+
                       '        <button type="button" ng-click="removeZSetItem(item.value)" class="btn btn-danger btn-xs">'+
                       '          <span class="glyphicon glyphicon-remove"></span>'+
                       '        </button>'+
                       '      </td>'+                       
                       '    </tr>'+
                       '  </tbody>'+
                       '</table>';                       
    var setTemplate =  '<button ng-click="addSetItem()" class="btn btn-default">Add Element</button>'+
                       '<table class="table">'+
                       '   <thead>'+
                       '    <th>Member</th>'+
                       '    <th>Remove</th>'+
                       '  </thead>'+
                       '  <tbody>'+
                       '    <tr ng-repeat="item in content.details.members">'+
                       '      <td>{{item}}</td>'+
                       '      <td>'+
                       '        <button ng-click="removeSetItem(item)" type="button" class="btn btn-danger btn-xs">'+
                       '          <span class="glyphicon glyphicon-remove"></span>'+
                       '        </button>'+
                       '      </td>'+                       
                       '    </tr>'+
                       '  </tbody>'+
                       '</table>';  

    var strTemplate =  '<form class="form-horizontal" role="form">'+
                       '   <button type="button" ng-click="updateStrItem(content.details.value)" class="btn btn-success btn-xs">'+
                       '     <span class="glyphicon glyphicon-pencil"></span>'+
                       '   </button>'+
                       '   <div class="form-group">'+
                       '     <label for="key" class="col-xs-2 control-label">Key</label>'+
                       '     <div class="col-xs-10">'+
                       '       <input type="text" disabled="disabled" class="form-control" id="key" value="{{content.details.key}}" placeholder="Key">'+
                       '     </div>'+
                       '   </div>'+
                       '   <div class="form-group">'+
                       '     <label for="value" class="col-xs-2 control-label">Value</label>'+
                       '     <div class="col-xs-10">'+
                       '       <textarea class="form-control" ng-disabled="true" id="value">{{content.details.value}}</textarea>'+
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
    };

    var linker = function(scope, element, attrs) {
      scope.rootDirectory = 'images/';
      scope.$watch('content',function(values) {
        if(scope.content.details){
          element.html(getTemplate(scope.content.details.type)).show();
        } else {
          element.html(getTemplate("")).show();
        }
        $compile(element.contents())(scope);
      }, true);

      scope.removeSetItem = function(item){
          scope.$parent.redisDetailsLoadingDone = false;
          var params = {'item': item,
                        'keyPath': scope.content.keypath};
          ahDashboardCommunicationService.action('removeRedisSetItem', params, function(err, response){
            scope.$parent.redisDetailsLoadingDone = true;
            scope.content.details = response.details;
            scope.$apply();
          });     
      };

      scope.removeHashItem = function(item){
          scope.$parent.redisDetailsLoadingDone = false; 
          var params = {'item': item,
                        'keyPath': scope.content.keypath};
          ahDashboardCommunicationService.action('removeRedisHashItem', params, function(err, response){
            scope.$parent.redisDetailsLoadingDone = true;
            scope.content.details = response.details;
            scope.$apply();
          });          
      };

      scope.removeZSetItem = function(item){
          scope.$parent.redisDetailsLoadingDone = false;    
          var params = {'item': item,
                        'keyPath': scope.content.keypath};
          ahDashboardCommunicationService.action('removeRedisZSetItem', params, function(err, response){
            scope.$parent.redisDetailsLoadingDone = true;
            scope.content.details = response.details;
            scope.$apply();
          });
      };

      scope.removeListItem = function(item){
        scope.$parent.redisDetailsLoadingDone = false;  
        var params = {'item': item,
                      'keyPath': scope.content.keypath};
        ahDashboardCommunicationService.action('removeRedisListItem', params, function(err, response){
          scope.$parent.redisDetailsLoadingDone = true;
          scope.content.details = response.details;
          scope.$apply();
        });              
      };

      scope.addUpdateHashItem = function(key, value){
        var modalInstance = $modal.open({
          templateUrl: 'modalRedisHashItem.html',
          controller: 'ahDashboardRedisModalController',
          resolve: {
            element: function () {
              return {name:key, value:value} || {};
            },
            newItem: function (){
              return !key;
            }
          }
        });

        modalInstance.result.then(function (element) {
          var params = {'item': element.name,
                        'value': element.value,
                        'keyPath': scope.content.keypath};
          ahDashboardCommunicationService.action('updateRedisHashItem', params, function(err, response){
            scope.$parent.redisDetailsLoadingDone = true;
            scope.content.details = response.details;
            scope.$apply();
          });
        }, function () {
          // Cancel clicked
        });
      };

      scope.addUpdateZSetItem = function(score, value){
        var modalInstance = $modal.open({
          templateUrl: 'modalRedisZSetItem.html',
          controller: 'ahDashboardRedisModalController',
          resolve: {
            element: function () {
              return {score:score, value:value} || {};
            },
            newItem: function (){
              return !score;
            }
          }
        });

        modalInstance.result.then(function (element) {
          var params = {'score': element.score,
                        'value': element.value,
                        'keyPath': scope.content.keypath};
          ahDashboardCommunicationService.action('updateRedisZSetItem', params, function(err, response){
            scope.$parent.redisDetailsLoadingDone = true;
            scope.content.details = response.details;
            scope.$apply();
          });
        }, function () {
          // Cancel clicked
        });
      };

      scope.addUpdateListItem = function(number, value){
        var modalInstance = $modal.open({
          templateUrl: 'modalRedisListItem.html',
          controller: 'ahDashboardRedisModalController',
          resolve: {
            element: function () {
              return {number:number, value:value} || {};
            },
            newItem: function (){
              return !value;
            }
          }
        });

        modalInstance.result.then(function (element) {
          var params;
          if(value){
            params = {'number': element.score,
                          'value': element.value,
                          'keyPath': scope.content.keypath};
            ahDashboardCommunicationService.action('updateRedisListItem', params, function(err, response){
              scope.$parent.redisDetailsLoadingDone = true;
              scope.content.details = response.details;
              scope.$apply();
            });
          } else {
            params = {'value': element.value,
                      'keyPath': scope.content.keypath};
            ahDashboardCommunicationService.action('addRedisListItem', params, function(err, response){
              scope.$parent.redisDetailsLoadingDone = true;
              scope.content.details = response.details;
              scope.$apply();
            });            
          }
        }, function () {
          // Cancel clicked
        });
      };

      scope.updateStrItem = function(value){
        var modalInstance = $modal.open({
          templateUrl: 'modalRedisStrItem.html',
          controller: 'ahDashboardRedisModalController',
          resolve: {
            element: function () {
              return {value:value} || {};
            },
            newItem: function (){
              return !value;
            }
          }
        });

        modalInstance.result.then(function (element) {
          var params = {'value': element.value,
                        'keyPath': scope.content.keypath};
          ahDashboardCommunicationService.action('updateRedisStrItem', params, function(err, response){
            scope.$parent.redisDetailsLoadingDone = true;
            scope.content.details = response.details;
            scope.$apply();
          });
        }, function () {
          // Cancel clicked
        });
      };

      scope.addSetItem = function(){
        var modalInstance = $modal.open({
          templateUrl: 'modalCreateRedisSetItem.html',
          controller: 'ahDashboardRedisModalController',
          resolve: {
            element: function () {
              return {};
            },
            newItem: function (){
              return true;
            }
          }
        });

        modalInstance.result.then(function (element) {
          var params = {'item': element.name,
                        'keyPath': scope.content.keypath};
          ahDashboardCommunicationService.action('addRedisSetItem', params, function(err, response){
            scope.$parent.redisDetailsLoadingDone = true;
            scope.content.details = response.details;
            scope.$apply();
          });
        }, function () {
         // Cancel clicked
        });
      };
    };

    return {
        restrict: "E",
        rep1ace: true,
        link: linker,
        scope: {
            content:'='
        }
    };
  });

  // Modal Dialog Controller and Templates
  app.controller('ahDashboardRedisModalController', function ($scope, $modalInstance, element, newItem) {
    $scope.element = element || {};
    $scope.newItem = newItem;
    $scope.ok = function () {
      $modalInstance.close($scope.element);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

  app.run(function($templateCache){
    $templateCache.put("modalCreateRedisSetItem.html", 
       '<div class="modal-header">'+
       '    <h3 class="modal-title">Create new Set Element</h3>'+
       '</div>'+
       '<div class="modal-body">'+
       '  <div class="form-group">'+
       '      <label for="elementName">Name</label>'+
       '      <input ng-model="element.name" class="form-control" id="elementName" placeholder="Enter value">'+
       '  </div>'+
       '</div>'+
       '<div class="modal-footer">'+
       '  <button class="btn btn-primary" ng-click="ok()">OK</button>'+
       '  <button class="btn btn-warning" ng-click="cancel()">Cancel</button>'+
       '</div>'
    );
    $templateCache.put("modalRedisHashItem.html", 
       '<div class="modal-header">'+
       '    <h3 class="modal-title">Create/Update Hash Element</h3>'+
       '</div>'+
       '<div class="modal-body">'+
       '  <div class="form-group">'+
       '      <label for="elementName">Field</label>'+
       '      <input ng-model="element.name" ng-disabled="newItem == false" class="form-control" id="elementName" placeholder="Enter value">'+
       '  </div>'+
       '  <div class="form-group">'+
       '      <label for="elementName">Value</label>'+
       '      <input ng-model="element.value" class="form-control" id="elementName" placeholder="Enter value">'+
       '  </div>'+       
       '</div>'+
       '<div class="modal-footer">'+
       '  <button class="btn btn-primary" ng-click="ok()">OK</button>'+
       '  <button class="btn btn-warning" ng-click="cancel()">Cancel</button>'+
       '</div>'
    );
    $templateCache.put("modalRedisZSetItem.html", 
       '<div class="modal-header">'+
       '    <h3 class="modal-title">Create/Update ZSet Element</h3>'+
       '</div>'+
       '<div class="modal-body">'+
       '  <div class="form-group">'+
       '      <label for="elementName">Score</label>'+
       '      <input ng-model="element.score" ng-disabled="newItem == false" class="form-control" id="elementName" placeholder="Enter value">'+
       '  </div>'+
       '  <div class="form-group">'+
       '      <label for="elementName">Value</label>'+
       '      <input ng-model="element.value" class="form-control" id="elementName" placeholder="Enter value">'+
       '  </div>'+       
       '</div>'+
       '<div class="modal-footer">'+
       '  <button class="btn btn-primary" ng-click="ok()">OK</button>'+
       '  <button class="btn btn-warning" ng-click="cancel()">Cancel</button>'+
       '</div>'
    );
    $templateCache.put("modalRedisListItem.html", 
       '<div class="modal-header">'+
       '    <h3 class="modal-title">Create/Update List Element</h3>'+
       '</div>'+
       '<div class="modal-body">'+
       '  <div class="form-group">'+
       '      <label for="elementName">Value</label>'+
       '      <input ng-model="element.value" class="form-control" id="elementName" placeholder="Enter value">'+
       '  </div>'+       
       '</div>'+
       '<div class="modal-footer">'+
       '  <button class="btn btn-primary" ng-click="ok()">OK</button>'+
       '  <button class="btn btn-warning" ng-click="cancel()">Cancel</button>'+
       '</div>'
    );

    $templateCache.put("modalRedisStrItem.html", 
       '<div class="modal-header">'+
       '    <h3 class="modal-title">Update String Element</h3>'+
       '</div>'+
       '<div class="modal-body">'+
       '  <div class="form-group">'+
       '      <label for="elementName">Value</label>'+
       '      <textarea ng-model="element.value" class="form-control" id="elementName" placeholder="Enter value"></textarea>'+
       '  </div>'+       
       '</div>'+
       '<div class="modal-footer">'+
       '  <button class="btn btn-primary" ng-click="ok()">OK</button>'+
       '  <button class="btn btn-warning" ng-click="cancel()">Cancel</button>'+
       '</div>'
    );  

    $templateCache.put("modalRedisCreateKey.html", 
       '<div class="modal-header">'+
       '    <h3 class="modal-title">Create new Key</h3>'+
       '</div>'+
       '<div class="modal-body">'+
       '  <div class="form-group">'+
       '      <label for="elementName">Key</label>'+
       '      <input ng-model="element.key" class="form-control" id="elementName" placeholder="Enter value">'+
       '  </div>'+
       '  <div class="form-group">'+
       '      <label for="elementName">Type</label>'+
       '      <select ng-model="element.type" class="form-control">'+
       '        <option value="string">String</option>'+
       '        <option value="list">List</option>'+
       '        <option value="hash">Hash</option>'+
       '        <option value="set">Set</option>'+
       '        <option value="zset">Sorted Set</option>'+
       '      </select>'+
       '  </div>'+
       '</div>'+
       '<div class="modal-footer">'+
       '  <button class="btn btn-primary" ng-click="ok()">OK</button>'+
       '  <button class="btn btn-warning" ng-click="cancel()">Cancel</button>'+
       '</div>'
    );
  });
});