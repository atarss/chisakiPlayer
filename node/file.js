var fs = require("fs");

function strIsEndWith(longStr, shortStr) {
	var longLength = longStr.length;
	var shortLength = shortStr.length;
	if (longStr.slice(longLength - shortLength) == shortStr) {
		return true;
	} else {
		return false;
	}
}

function readDirRec(location, patternStr, fileList) {
	// **ATTENTION**  Location should be end with '/'

	var files = fs.readdirSync(location);
	for (i in files) {
		var thisAbsLocation = location + files[i];
		stat = fs.lstatSync(thisAbsLocation);
		if (stat.isDirectory()){
			readDirRec(thisAbsLocation + "/", patternStr, fileList);
		} else if (strIsEndWith(thisAbsLocation, patternStr)) {
			fileList.push(thisAbsLocation);
		}
	}
}

exports.getFileFromDirByPattern = function(pathLocation, patternStr) {
	var fileList = new Array();
	readDirRec(pathLocation, patternStr, fileList);
	return fileList;
}

