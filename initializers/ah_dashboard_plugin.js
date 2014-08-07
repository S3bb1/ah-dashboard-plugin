var ah_dashboard_plugin = function(api, next){
  var TS = require('redis-timeseries');
  var timeSeries = new TS(api.redis.client);
  api.ahDashboard = {};
  api.ahDashboard.timesSeries = timeSeries;
  api.ahDashboard.prevStats = {};
  api.chatRoom.add("logMessages");
  var spawn = require('child_process').spawn;
  var tail = spawn("tail", ["-f", api.config.general.paths.log[0] + '/' + api.pids.title + '.log']);
  tail.stdout.on("data", function (data) {
    api.chatRoom.broadcast({room: "logMessages"}, "logMessages", data.toString());
  });
  next();
}

/////////////////////////////////////////////////////////////////////
// exports
exports.ah_dashboard_plugin = ah_dashboard_plugin;