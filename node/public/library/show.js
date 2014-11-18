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
					id : result[i]._id
				});
			}

			resp.end(JSON.stringify({
				path : apiConfig.musicLibraryFolder,
				length : newResult.length,
				result : newResult
			}));
		});
	}
}
