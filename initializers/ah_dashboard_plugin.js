var ah_dashboard_plugin = function(api, next){
  var TS = require('redis-timeseries');
  var Tail = require('always-tail');
  var timeSeries = new TS(api.redis.client);
  api.ahDashboard = {};
  api.ahDashboard.timesSeries = timeSeries;
  api.ahDashboard.prevStats = {};
  api.chatRoom.add("logMessages");
  var spawn = require('child_process').spawn;


  tail = new Tail(api.config.general.paths.log[0] + '\\' + api.pids.title + '.log');

  tail.on("line", function(data) {
    api.chatRoom.broadcast({room: "logMessages"}, "logMessages", data.toString());
  });

  tail.on("error", function(error) {
    console.log('ERROR: ', error);
  });
  next();
}

/////////////////////////////////////////////////////////////////////
// exports
exports.ah_dashboard_plugin = ah_dashboard_plugin;