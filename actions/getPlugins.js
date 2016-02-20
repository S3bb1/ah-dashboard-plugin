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
    var foundPlugins = [];

    // try to get any plugin link 
    [ 'actions', 'tasks', 'public', 'servers', 'initializers'].forEach(function(pluginPath){
      // get a local link directory
      var localLinkDirectory = api.projectRoot + path.sep + pluginPath + path.sep +  'plugins';

      // check if the directory exists
      if( fs.existsSync(localLinkDirectory) ){
        // when it exists, read the whole directory
        var pluginDir = fs.readdirSync(localLinkDirectory);
        // now iterate over all registered plugins
        for(var i=0; i<pluginDir.length; i++){
          // because the linked file is named ***.link we have to split it
          var pluginNameSplitted = pluginDir[i].split('.');
          if(pluginNameSplitted.length === 2){
            // get the plugin name 
            var pluginName = pluginNameSplitted[0];
            // add it to the plugins array when it not contains the plugin already
            if(plugins.indexOf(pluginName) === -1){
              plugins.push(pluginName);
            }            
          }
        }
      }
    });

    // now iterate over all registered plugin folders
    api.config.general.paths.plugin.forEach(function(pluginPath){

      // in each folder we have to iterate over all found plugins
      plugins.forEach(function(pluginName){
        // now check if the plugin exists in the current plugin path
        var pluginPathAttempt = path.normalize(pluginPath + path.sep + pluginName);
        if(fs.existsSync(pluginPath + path.sep + pluginName) ){

          // set the package base to the registered plugin path + the current plugin name
          var pluginPackageBase = pluginPath + path.sep + pluginName;
          var foundPlugin = {};

          var package_json = String(fs.readFileSync(pluginPackageBase + '/package.json'));
          var readme = String(pluginPackageBase + '/README.md');
          var changelog = String(pluginPackageBase + '/VERSIONS.md');

          foundPlugin.readme = 'n.a.';
          if (fs.existsSync(readme)) {
            foundPlugin.readme = markdown.toHTML(fs.readFileSync(readme, 'utf8'));
          }

          foundPlugin.changelog = 'n.a.';
          if (fs.existsSync(changelog)) {
            foundPlugin.changelog = markdown.toHTML(fs.readFileSync(changelog, 'utf8'));
          }

          foundPlugin.version = JSON.parse(package_json).version;
          foundPlugin.name = JSON.parse(package_json).name;
          foundPlugin.description = JSON.parse(package_json).description;
          foundPlugins.push(foundPlugin);
        }
      });
    });
    data.response.plugins = foundPlugins;

    next();
  }, next );
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
