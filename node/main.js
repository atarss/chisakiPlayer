// var fileName = "/run/media/andy/9868B60F68B5EBDE/mp3lib/ACG/Single/[20140205][ebb and flow][Ray]/01. ebb and flow.mp3";
var pathName = "/home/andy";

var http = require("http");
var fs = require('fs');
var mm = require('musicmetadata');
var chisakiFile = require("./file.js");

var fileList = chisakiFile.getFileFromDirByPattern(path, ".mp3");
var counter = fileList.length;

for (index in fileList) {
  var fileName = fileList[index];
  var parser = mm(fs.createReadStream(fileName));
  parser.thisIndex = index;

  parser.on('title', function (result) {
  	parser.stream.close();
    console.log("[" + this.thisIndex + "] " + result);
  });
}
