## Version 0.6.2 (26-Feb-2016)
* Fixes Logo Link (navigated to empty page instead of homepage) thx @Zougi
* Replace Task Logic to implement current node-resque api
* Enable Task statistics without running scheduler too

## Version 0.6.1 (20-Feb-2016)
* Added License information
* Removed Files which were falsly published


## Version 0.6.0 (20-Feb-2016)
* ActionHero V13 Support
* change the plugin retrieval logic, because in AH v13 the plugins are linked dynamically
* add all bower components to the plugin, so that no "bower install" is needed anymore
* "remove index2.html because it does not exists!!" (THX @Zougi)


## Version 0.5.0 (1-Feb-2016)
* ActionHer V12 Support
* Add New Version From AdminLTE
* Remove drag/drop/add/remove Widget logic from Dashboard
* Wired new Node-Resque Task Stats
* Rewrite of ah-stats
* First rudimentary Mobile Support

## Version 0.4.0 (1-Feb-2016)
* ActionHero V11 Support

## Version 0.3.0 (26-Jan-2015)
* ActionHero V10 Support
* Bugfix issue with plugins page
* Adjusted Logfile read config to start at the end
* Added file exists for logfile if its located elsewhere (thx @JoHense)

## Version 0.2.0 (26-Oct-2014)
* Finalization of REDIS Viewer
** Now you can Add/Edit/Remove Keys
* Added registered Plugins Overview ( thx @schlechtweg )

## Version 0.1.5 (10-Oct-2014)
* Bugfixed missing Dependency

## Version 0.1.4 (06-Oct-2014)
* Added First implementation of Redis Viewer
** New Menu Item "Redis"
** FancyTree to Visualize Tree structure of current connected REDIS
** Simple Viewer for selected Items
** Context Menu in Tree to Refresh specific Keys