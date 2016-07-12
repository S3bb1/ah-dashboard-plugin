define(['app'], function (app) {
  app.controller('ahDashboardArchitecture', function ($scope, ahDashboardCommunicationService) {
    ahDashboardCommunicationService.action('getRedisInfos', function (err, data) {
      $scope.redisSentinels = data.sentinelServers;
      $scope.redisData = data.redisInfo;
      $scope.$apply();
    });
  });
});