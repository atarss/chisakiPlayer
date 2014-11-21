// API : get/album.js
// By Andy 2014

exports.worker = function(req, resp, httpReq) {
	var query = req.query;
	if (query.album_id) {
		apiDb.getAlbumInfo(query.album_id, function(res){
			if (res) {
				resp.end(JSON.stringify({
					albumId : query.album_id,
					album : res.album,
					artist : res.artist,
					tracks : res.tracks
				}));
			} else {
				resp.end(JSON.stringify({
					error : {
						illegal_id : query.id
					}
				}));
			}
		});
	} else {
		resp.end(JSON.stringify({
			error : {
				missing_argument : "album_id"
			}
		}));
	}
}
