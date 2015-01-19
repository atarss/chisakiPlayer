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
		var startTime = new Date();

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
							albumArtist : result.albumartist[0],
							year : result.year,
							genre : result.genre[0],
							duration : result.duration,
							fileName : this.fileName
						};

						if (result.track) { tmpObj.track = result.track; }
						if (result.disk) { tmpObj.disk = result.disk; }

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

			// check album
			var albumArr = [];
			var checkAlbumExist = function(albumStr, artistStr, dataArr) {
				for (var len=0; len < dataArr.length; len++){
					var tmpAlbum = dataArr[len].album;
					var tmpArtist = dataArr[len].artist;

					if ((albumStr == tmpAlbum) && (artistStr == tmpArtist)) {
						return true;
					}
				}

				return false;
			}

			for (var i=0, len=parseResult.length; i<len; i++) {
				var tmpAlbumStr = parseResult[i].album;
				var tmpArtistStr = parseResult[i].artist;
				if (parseResult[i].albumArtist) tmpArtistStr = parseResult[i].albumArtist;

				if (! checkAlbumExist(tmpAlbumStr, tmpArtistStr, albumArr)) {
					albumArr.push({
						album : tmpAlbumStr,
						artist : tmpArtistStr
					});
				}
			}

			// DB Operation Here.
			console.log(JSON.stringify(albumArr));
			apiDb.insertAlbumArr(albumArr, function(albumResult){
				var getAlbumDatabaseId = function(albumStr, artistStr, dataArr) {
					for (var i=0, len=dataArr.length; i<len; i++){
						var tmpAlbum = dataArr[i].album;
						var tmpArtist = dataArr[i].artist;

						if ((albumStr == tmpAlbum) && (artistStr == tmpArtist)) {
							console.log(dataArr[i]._id);
							return dataArr[i]._id;
						}
					}

					//not found (?!)
					return null;
				}

				for (var i=0, len=parseResult.length; i<len; i++) {
					var tmpAlbumStr = parseResult[i].album;
					var tmpArtistStr = parseResult[i].artist;
					if (parseResult[i].albumArtist) tmpArtistStr = parseResult[i].albumArtist;

					parseResult[i].albumId = getAlbumDatabaseId(tmpAlbumStr, tmpArtistStr, albumResult);
				}

				apiDb.rebuildMusicLibrary(parseResult, function(result){
					var endTime = new Date();

					resp.end(JSON.stringify({
						time : endTime - startTime,
						path : apiConfig.musicLibraryFolder,
						length : result.length
					}));

					apiUtils.musicLibraryLock = false;
				});
			});
		});

		queue.startQueue();
	}
}
