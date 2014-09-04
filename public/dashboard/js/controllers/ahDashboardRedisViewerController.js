define(['app'], function (app) {
  app.controller('ahDashboardRedisViewer', function ($scope) {

    /* Load tree from Ajax JSON
     */
    $("#redisKeys").fancytree({
      source: {
        url: "/api/getAllRedisKeys"
      },
      postProcess: function(event, data){
        data.result = data.response.redisKeys
      },
      lazyLoad: function(event, data){
        data.result = {url: "/api/getAllRedisKeys?prefix="+data.node.data.attr.id}
      }
    });
  });
});