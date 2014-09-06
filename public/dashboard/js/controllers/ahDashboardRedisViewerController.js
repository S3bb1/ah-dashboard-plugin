define(['app'], function (app) {
  app.controller('ahDashboardRedisViewer', function ($scope) {
    $("#redisKeys").fancytree({
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
        keyPath = keyPath.replace(/\//, ':');
        data.result = {url: "/api/getAllRedisKeys?prefix="+keyPath}
      }
    });
  });
});