// API : library/show.js
// By Andy 2014
// Display All Tracks in Media Library

exports.worker = function(req, resp) {

	// check for musicLibraryLock
	if (apiUtils.musicLibraryLock) {
		// cannot control music library now
		resp.end(JSON.stringify({
			error : "Music library has been locked."
		}));
	} else {
		apiDb.showMusicLibrary(function(result){
			var newResult = [];
			for (i in result) {
				newResult.push({
					title : result[i].title,
					album : result[i].album,
					artist : result[i].artist,
					year : result[i].year,
					genre : result[i].genre,
					duration : result[i].duration,
					fileName : result[i].fileName,
					id : result[i]._id
				});
			}
			resp.end(JSON.stringify({
				path : apiConfig.musicLibraryFolder,
				result : newResult
			}));
		});
	}
}
