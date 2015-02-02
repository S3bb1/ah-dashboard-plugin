define(['app'], function (app) {
  app.controller('ahDashboardUsers', function ($scope, $modal) {
    $scope.getUsers = function(){
      $.get('/api/getUsers', function (data) {
        $scope.users = data.users;
        $scope.$apply();
      });
    };
    $scope.getUsers();


    $scope.addUser = function(){
      var modalInstance = $modal.open({
        templateUrl: 'modalCreateNewUser.html',
        controller: 'ahDashboardUsersModalController',
        resolve: {
          element: function () {
            return {};
          }
        }
      });

      modalInstance.result.then(function (element) {
        $.get("/api/userAdd?username="+encodeURIComponent(element.username)+"&password="+encodeURIComponent(element.password)+"&email="+encodeURIComponent(element.email)+"&firstName="+encodeURIComponent(element.firstName)+"&lastName="+encodeURIComponent(element.lastName))
        .done(function(response) {
          $scope.getUsers();
        }); 
      }, function () {
       // Cancel clicked
      });
    };
  });

  // Modal Dialog Controller and Templates
  app.controller('ahDashboardUsersModalController', function ($scope, $modalInstance, element) {
    $scope.element = element || {};
    $scope.ok = function () {
      $modalInstance.close($scope.element);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

  app.run(function($templateCache){
    $templateCache.put("modalCreateNewUser.html", 
       '<div class="modal-header">'+
       '    <h3 class="modal-title">Create new User</h3>'+
       '</div>'+
       '<div class="modal-body">'+
       '  <div class="form-group">'+
       '      <label for="elementName">Username</label>'+
       '      <input ng-model="element.username" class="form-control" id="elementName" placeholder="Enter Username">'+
       '  </div>'+
       '  <div class="form-group">'+
       '      <label for="elementName">Email</label>'+
       '      <input ng-model="element.email" class="form-control" id="elementName" placeholder="Enter Email">'+
       '  </div>'+
       '  <div class="form-group">'+
       '      <label for="elementName">Password</label>'+
       '      <input ng-model="element.password" class="form-control" id="elementName" placeholder="Enter Password">'+
       '  </div>'+
       '  <div class="form-group">'+
       '      <label for="elementName">First Name</label>'+
       '      <input ng-model="element.firstName" class="form-control" id="elementName" placeholder="Enter First Name">'+
       '  </div>'+
       '  <div class="form-group">'+
       '      <label for="elementName">Last Name</label>'+
       '      <input ng-model="element.lastName" class="form-control" id="elementName" placeholder="Enter Last Name">'+
       '  </div>'+
       '</div>'+
       '<div class="modal-footer">'+
       '  <button class="btn btn-primary" ng-click="ok()">OK</button>'+
       '  <button class="btn btn-warning" ng-click="cancel()">Cancel</button>'+
       '</div>'
    );
  });
});