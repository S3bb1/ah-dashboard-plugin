// https://github.com/evilstreak/markdown-js
var markdown = require( "markdown" ).markdown;
var fs = require('fs');

exports.simpleHtmlTransformation = function ( test ) {


  fs.readFile('./README.md', 'utf8', function (err,data) {
    if (err) {
      test.fail();
    }
    console.log( markdown.toHTML(data) );
    test.done();
  });

};
