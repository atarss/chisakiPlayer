// API : list/id.js
// By Andy 2014
// Display All Tracks in Media Library

exports.worker = function(req, resp) {

	apiDb.showMusicLibraryId(function(result){
		var newResult = [];
		for (i in result) {
			newResult.push({
				id : result[i]._id
			});
		}

		resp.end(JSON.stringify(newResult));
	});
}
