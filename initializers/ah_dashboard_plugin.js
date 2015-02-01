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

    // store logfile path
    var logFile = api.config.general.paths.log[0] + path.sep + api.pids.title + '.log';
    // check if logfile exists
    if(fs.existsSync(logFile)) {
      // create logMessages chatRoom
      api.chatRoom.add("logMessages");
      // get logFile stats
      var logFileStats = fs.statSync(logFile);
      // init Tail for the logFile and start at the end
      tail = new Tail(logFile, null, {start: logFileStats.size});

      tail.on("line", function (data) {
        api.chatRoom.broadcast({room: "logMessages"}, "logMessages", data.toString());
      });

      tail.on("error", function (error) {
        console.log('ERROR reading log file: ' + error);
      });
    } else {
      console.log('Cant locate log files, log file view in dashboard is disabled.');
    }
    next();
  }
};