var fs = require('fs');
var path = require('path');
var markdown = require( "markdown" ).markdown;

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
    api.config.general.plugins.forEach(function(plugin2){
      var pluginPackageBase = path.normalize(p + '/' + plugin2);
      if(api.project_root != pluginPackageBase){
        var plugin = {};

        var package_json = String(fs.readFileSync(pluginPackageBase + '/package.json'));
        var readme = String(pluginPackageBase + '/README.md');
        var changelog = String(pluginPackageBase + '/VERSIONS.md');

        plugin.readme = 'n.a.';
        if (fs.existsSync(readme)) {
          plugin.readme = markdown.toHTML(fs.readFileSync(readme, 'utf8'));
        }

        plugin.changelog = 'n.a.';
        if (fs.existsSync(changelog)) {
          plugin.changelog = markdown.toHTML(fs.readFileSync(changelog, 'utf8'));
        }

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
