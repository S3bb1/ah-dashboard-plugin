var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'reEnqueueTask';
action.description = 'I will reenqueue a failed task';
action.inputs = {
  taskdefinition: {
    required: true
  }
};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function (api, data, next) {
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    var taskDefinition = data.params.taskdefinition;
    api.resque.scheduler.connection.redis.lrem('resque:failed', 0, taskDefinition.replace(/\\/g, "\\"), function(err, result){
      var taskParsed = JSON.parse(taskDefinition);
      api.resque.scheduler.connection.redis.del('resque:workerslock:'+taskParsed.payload.class+':'+taskParsed.payload.queue+':'+JSON.stringify(taskParsed.payload.args), function(err, result){
        api.tasks.enqueueIn(5000, taskParsed.payload.class, taskParsed.payload.args, taskParsed.payload.queue);
        next();
      });
    });
  }, next);

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
