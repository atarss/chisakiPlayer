// API : list/id.js
// By Andy 2014
// Display All Tracks in Media Library

exports.worker = function(req, resp) {

	apiDb.showMusicLibrarySimple(function(result){
		var newResult = [];
		for (i in result) {
			newResult.push({
				id : result[i]._id,
				title : result[i].title,
				album : result[i].album,
				artist : result[i].artist,
				duration : result[i].duration
			});
		}

		resp.end(JSON.stringify({
			path : apiConfig.musicLibraryFolder,
			length : newResult.length,
			result : newResult
		}));
	});
}
