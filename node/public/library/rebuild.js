// API : library/rebuild.js
// By Andy 2014
// Clear music library data and rebuild it.

var mm = require('musicmetadata');
var fs = require("fs");

exports.worker = function(req, resp) {

	// check for musicLibraryLock

	if (apiUtils.musicLibraryLock) {
		// cannot control music library now
		resp.end(JSON.stringify({
			error : "Music library has been locked."
		}));
	} else {
		//add a lock here
		apiUtils.musicLibraryLock = true;

		apiUtils.sysLog("Start Loding Music Lib : " + apiConfig.musicLibraryFolder);
		var musicFileList = [];
		for (i in apiConfig.musicLibraryFolder) {
			musicFileList = musicFileList.concat(apiUtils.getFileFromDirByPattern(apiConfig.musicLibraryFolder[i] , ".mp3"));
		}

		//remove duplication
		musicFileList = musicFileList.sort().filter(function(item, pos) {
        	return !pos || item != musicFileList[pos - 1];
    	});

		var queue = new processQueue();
		queue.maxWorkers = 5;
		var parseResult = [];
		for (i in musicFileList) {
			var fileName = musicFileList[i];
			queue.push(function(_fileName){
				var resultFunc = function(callback){
					var parser = mm(fs.createReadStream(_fileName) , { duration : true });
					parser.fileName = _fileName;

					parser.on('metadata', function (result){
						result.filePath = this.fileName;

						if (! result.artist) {
							result.artist = [];
						}
						if (! result.genre) {
							result.genre = [];
						}

						var tmpObj = {
							title : result.title,
							album : result.album,
							artist : result.artist[0],
							year : result.year,
							genre : result.genre[0],
							duration : result.duration,
							fileName : this.fileName
						};

						parseResult.push(tmpObj);
					});

					parser.on('done', function (err) {
		  				if (err) throw err;
		  				apiUtils.sysLog("ID3 Parser for '" + this.fileName + "' is done.");
	  					parser.stream.destroy();
	  					callback();
					});
				}

				return resultFunc;

			}(fileName));
		}

		queue.push(function(callback){
			queue.destroyQueue();

			//DB Operation Here.
			apiDb.rebuildMusicLibrary(parseResult, function(){
				apiDb.showMusicLibrary(function(libResult){
					resp.end(JSON.stringify({
						path : apiConfig.musicLibraryFolder,
						result : libResult
					}));
					apiUtils.musicLibraryLock = false;
				});
			});
		});

		queue.startQueue();
	}
}
