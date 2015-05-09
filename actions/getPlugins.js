var fs = require('fs');
var path = require('path');
var markdown = require( "markdown" ).markdown;

var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getPlugins';
action.description = 'I will return all registered plugins';
action.inputs = {};
action.blockedConnectionTypes = [];
action.outputExample = {
};

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, data, next){
  api.ahDashboard.session.checkAuth(data, function(session){
    var plugins = [];
    api.config.general.paths.plugin.forEach(function(p){
      api.config.general.plugins.forEach(function(pluginName){
        var pluginPackageBase = path.normalize(p + '/' + pluginName);
        // Check if plugin folder isnt ah root folder AND the folder exists (if multiple plugins folder are defined)
        if(api.project_root != pluginPackageBase && fs.existsSync(pluginPackageBase)){
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

    data.response.plugins = plugins;

    next();
  }, next );
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
