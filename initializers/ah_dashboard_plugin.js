module.exports = {
  startPriority: 1000,
  start: function(api, next){
    api.log("init dashboard functionalities");

    // load needed plugins
    var TS = require('redis-timeseries');
    var timeSeries = new TS(api.redis.client);

    api.ahDashboard = {};
    api.ahDashboard.timesSeries = timeSeries;
    api.ahDashboard.prevStats = {};

    // add the logMessages Room
    api.chatRoom.add("logMessages");
    // create a listener for winston module to broadcast the logmessage to the room
    api.logger.on('logging', function (transport, level, msg, meta) {
      // check if the console transport is active
      if(transport.name === 'console'){
        // broadcast the logmessage to the chatRoom
        api.chatRoom.broadcast({room: "logMessages"}, "logMessages", new Date().toISOString() + ' - ' + level+": "+msg+JSON.stringify(meta));
      }
    });


    // Create a new middleware for the statsCounter 
    var middleware = {
      name: 'statsCounter',
      global: true,
      priority: 1000,
      postProcessor: function(data, next){
        // after every action log a hit into timeseries
        api.ahDashboard.timesSeries.recordHit("actions:"+data.action, undefined, 1).exec();
        // add also the key to the statsKeys if it doesnt exists
        api.redis.client.hmset("stats:keys", "actions:"+data.action, "", function(){
          next();
        });
      }
    };
    api.actions.addMiddleware(middleware);


    next();
  }
};