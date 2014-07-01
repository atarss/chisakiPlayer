var fileName = "/run/media/andy/9868B60F68B5EBDE/mp3lib/ACG/Single/[20140205][ebb and flow][Ray]/01. ebb and flow.mp3";

var http = require("http");
var fs = require('fs');
var mm = require('musicmetadata');

// create a new parser from a node ReadStream

http.createServer(function (req, res) {
  var parser = mm(fs.createReadStream(fileName));

  // listen for the metadata event
  parser.on('metadata', function (result) {
    console.log(result);
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(result.picture[0].data);
  });

}).listen(1337, '127.0.0.1');
