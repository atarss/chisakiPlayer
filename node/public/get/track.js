// API : get/track.js
// By Andy 2014

exports.worker = function(req, resp, httpReq) {
	var query = req.query;
	if (query.id) {
		apiDb.getInfoFromId(query.id, function(res){
			if (res) {
				resp.end(JSON.stringify({
					id : res._id,
					title : res.title,
					album : res.album,
					artist : res.artist,
					genre : res.genre,
					year : res.year,
					fileName : res.fileName
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
				missing_argument : "id"
			}
		}));
	}
}
