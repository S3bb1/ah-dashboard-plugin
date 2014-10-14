var fs = require('fs');
var path = require('path');

var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getPlugins';
action.description = 'I will return all registered plugins';
action.inputs = {
  'required' : [],
  'optional' : []
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){

  var plugins = [];

//loop over it's plugins
  api.config.general.paths.plugin.forEach(function(p){
    api.config.general.plugins.forEach(function(plugin){
      var pluginPackageBase = path.normalize(p + '/' + plugin);
      if(api.project_root != pluginPackageBase){

        package_json = String(fs.readFileSync(pluginPackageBase + '/package.json'));
        var version = JSON.parse(package_json).version
        var plugin = {};
        plugin.version = JSON.parse(package_json).version;
        plugin.name = JSON.parse(package_json).name;
        plugin.description = JSON.parse(package_json).description;
        plugins.push(plugin);
      }
    });
  });

  connection.response.plugins = plugins;



  next(connection, true);
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
