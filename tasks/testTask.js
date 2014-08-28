var calcStatus = {
  name:          'testTask',
  description:   'I calculate statistics',
  queue:         'default',
  plugins:       [],
  pluginOptions: [],
  frequency:     10000,
  run: function(api, params, next){
    setTimeout(function(){
      next(true, null);
    }, 6000)

  }
};

exports.calcStatus = calcStatus;
