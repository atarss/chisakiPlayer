// API : detection/detect.js
// By Andy 2014
var util = require('util');

exports.worker = function(req, resp) {
	apiDb.showMusicLibraryInfo(function(result){
		resp.end(JSON.stringify(result));
	})
}
