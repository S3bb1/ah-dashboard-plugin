module.exports = {
  startPriority: 1000,
  start: function(api, next){
    api.log("init dashboard functionalities");

    // load needed plugins
    var path = require('path');
    var fs = require('fs');
    var TS = require('redis-timeseries');
    var Tail = require('always-tail');
    var timeSeries = new TS(api.redis.client);

    api.ahDashboard = {};
    api.ahDashboard.timesSeries = timeSeries;
    api.ahDashboard.prevStats = {};
    api.chatRoom.add("logMessages");
    api.logger.on('logging', function (transport, level, msg, meta) {
      if(transport.name === 'file'){
        console.log(level+": "+msg+JSON.stringify(meta));
        api.chatRoom.broadcast({room: "logMessages"}, "logMessages", new Date().toISOString() + ' - ' + level+": "+msg+JSON.stringify(meta));
      }
      
    });
    next();
  }
};