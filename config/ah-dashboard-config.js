exports.default = { 
  stats: function(api){
    return {
      // Used to match the default config/stats.js, this helps store previous statistics. 
      prevKeys: [
        'actionhero:prevStats'
      ]
    }
  }
}
