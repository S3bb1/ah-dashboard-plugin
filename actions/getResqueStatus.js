var action = {};

/////////////////////////////////////////////////////////////////////
// libraries

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getResqueStatus';
action.description = 'I will return all informations about the current node-resque status';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function (api, data, next) {
  // Check authentication for current Request
  api.ahDashboard.session.checkAuth(data, function(session){
    api.tasks.allDelayed(function(err, jobs){
      data.response.delayed = jobs;
      api.tasks.details(function(err, details){
        data.response.details = details;
        api.tasks.failed(0, -1, function(err, failedJobs){
          data.response.failedJobs = failedJobs;
          next();
        });
        
      });
    });
  }, next);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
