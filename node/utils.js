var fs = require("fs");
var path  = require('path');
var colors = require('colors/safe');

var getFormattedDate = function(date){
	if (! date) {
		var date = new Date();
	}

	var lenFunc = function(str,len){
		str += ""; //Change to Str
		if (str.length > len) {
			str = str.slice(0,len);
		} else {
			while (str.length < len){
				str = "0"+str;
			}
			return str;
		}
	}

	var tmpStr = "";
	tmpStr += lenFunc(date.getFullYear(), 4);
	tmpStr += lenFunc(date.getMonth()+1, 2);
	tmpStr += lenFunc(date.getDate(), 2);
	tmpStr += "-";
	tmpStr += lenFunc(date.getHours(),2);
	tmpStr += lenFunc(date.getMinutes(),2);
	tmpStr += lenFunc(date.getSeconds(),2);
	tmpStr += ".";
	tmpStr += lenFunc(date.getMilliseconds(),3);

	return tmpStr;
}

var sysLog = function(str) {
	console.log(colors.white(getFormattedDate() + " [LOG]   " + str));
};

var sysErr = function(str) {
	console.log(colors.red(getFormattedDate() + " [ERROR] " + str));
};

var sysDebug = function(str) {
	console.log(colors.yellow(getFormattedDate() + " [DEBUG] " + str));
};

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

var getFileFromDirByPattern = function(pathLocation, patternStr) {
	var fileList = new Array();
	readDirRec(pathLocation, patternStr, fileList);
	return fileList;
}

var registerSigint = function(func){
	process.on("SIGINT", function(){
		sysLog("Got SIGINT, quit now.");
		if (func) {
			func();
		}
		process.exit(0);
	});	
}

var musicLibraryLock = false;

var httpResponseErr = function(errObj, resp){
	resp.end(JSON.stringify({
		error : errObj
	}));
}

exports.sysLog = sysLog;
exports.sysErr = sysErr;
exports.getFileFromDirByPattern = getFileFromDirByPattern;
exports.registerSigint = registerSigint;
exports.musicLibraryLock = musicLibraryLock;
exports.httpResponseErr = httpResponseErr;
