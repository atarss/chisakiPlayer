var fs = require("fs");
var fileList = new Array();
var startLocation = "/home/andy/";

function strIsEndWith(longStr, shortStr) {
	var longLength = longStr.length;
	var shortLength = shortStr.length;
	if (longStr.slice(longLength - shortLength) == shortStr) {
		return true;
	} else {
		return false;
	}
}

function readDirRec(location) {
	// Location should be end with '/'

	// console.log("Going into " + location);
	var files = fs.readdirSync(location);

	for (i in files) {
		var thisAbsLocation = location + files[i];
		stat = fs.lstatSync(thisAbsLocation);
		if (stat.isDirectory()){
			// console.log(thisAbsLocation + "/");
			readDirRec(thisAbsLocation + "/");
		}
	}
}


console.log(strIsEndWith("asdashdkahsdk.mp3", ".mp3"));