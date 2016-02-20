ActionHero Dashboard
===================

## Important Note!!!
* ah-dashboard 0.6.* is compatible with actionHero v13
* ah-dashboard 0.5.* is compatible with actionHero v12 
* ah-dashboard 0.4.* is compatible with actionHero v11
* ah-dashboard 0.3.* is compatible with actionHero v10 
* ... for lower actionHero versions use 0.2.0!!!

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/S3bb1/ah-dashboard-plugin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM](https://nodei.co/npm/ah-dashboard-plugin.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ah-dashboard-plugin/)

## Install

- `npm install ah-dashboard-plugin --save`

**ONLY FOR ACTIONHERO v13.X**
run `actionhero link --name=ah-dashboard-plugin` to register the Dashboard in ActionHero v13

**ONLY FOR ACTIONHERO v12.X or lower**
- add the dashboard to your plugins (config/plugins.js) config:
  `plugins: ["ah-dashboard-plugin"]`


## Configuration

To use full functionalities, make sure a task scheduler is running!

Also...
  Make sure api.config.task's minTaskProcessors and maxTaskProcessors is set to some value greater than 0.
  Ensure 'simpleRouting' and 'queryRouting' are true in config/servers/web.js

## Running

after including into ActionHero and running ActionHero, goto http://localhost:8080/dashboard/index.html

initally a default admin user is created with 
**username: admin**
**password: admin**

## Overview

This Plugin should provide a simple powerful administration dashboard for the ActionHero

Features :
- Secured Actions/Dashboard by session based user system
- Show statistics over time for all created stats from actionhero
- Drag and Drop Dashboard with custom widgets ( Time, CPU usage, ... )
- Overview of all registered Actions
- Real Time Logs from ActionHero over Chat functionality
- Overview of all registered Routes
- Overview of Tasks
- REDIS Viewer and Modifier (Show/Edit/Add/Remove)

Todos:

- Create/Update/Delete Routes
- More Widgets for Dashboard
- More Visualizations for Statistics
- Custom Statistics Events
- Visulaization of Clustered ActionHeros
- TESTS!
- Redesign Logging mechanism


## License
The MIT License (MIT)

Copyright (c) 2015 Sebastian Dechant

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
