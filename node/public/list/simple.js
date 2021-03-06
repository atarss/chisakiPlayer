// API : list/simple.js
// By Andy 2014
// Display All Tracks in Media Library, show simple infomation

exports.worker = function(req, resp) {

	apiDb.showMusicLibrarySimple(function(result){
		var newResult = [];
		for (i in result) {
			newResult.push({
				trackId : result[i]._id,
				title : result[i].title,
				album : result[i].album,
				albumId : result[i].albumId,
				artist : result[i].artist,
				duration : result[i].duration
			});
		}

		resp.end(JSON.stringify(newResult));
	});
}
