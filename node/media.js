// var fileName = "/run/media/andy/9868B60F68B5EBDE/mp3lib/ACG/Single/[20140205][ebb and flow][Ray]/01. ebb and flow.mp3";
var pathName = "/run/media/andy/9868B60F68B5EBDE/mp3lib/ACG/Single/";

var http = require("http");
var fs = require('fs');
var mm = require('musicmetadata');
var chisakiFile = require("./file.js");

var fileList = chisakiFile.getFileFromDirByPattern(pathName, ".mp3");
var counter = fileList.length;
var lastCounter = counter;

process.setMaxListeners(10);

var consoleClock = setInterval(function(){
  if (counter == 0) {
    console.log("***** All Done *****");
    clearInterval(consoleClock);
  } else {
    if (! counter == lastCounter) {
      console.log("["+counter+ "/" +fileList.length+"] to be done...");
      lastCounter = counter;
    }
  }
}, 100);

for (index in fileList) {
  var fileName = fileList[index];
  var parser = mm(fs.createReadStream(fileName));
  parser.thisIndex = index;

  parser.on('title', function (result) {
    parser.stream.close();
    console.log("[" + this.thisIndex + "] " + result);
    counter -= 1;
  });
}
