// API : list/full.js
// By Andy 2014
// Display All Tracks in Media Library

exports.worker = function(req, resp) {

	apiDb.showMusicLibraryFull(function(result){
		var newResult = [];
		for (i in result) {
			newResult.push({
				trackId : result[i]._id,
				title : result[i].title,
				album : result[i].album,
				albumId : result[i].albumId,
				artist : result[i].artist,
				albumArtist : result[i].albumArtist,
				duration : result[i].duration,
				track : result[i].track,
				disk : result[i].disk,
				fileName : result[i].fileName
			});
		}

		resp.end(JSON.stringify(newResult));
	});
}
