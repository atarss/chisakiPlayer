// API : get/albumList.js
// By Andy 2014

exports.worker = function(req, resp, httpReq) {

	apiDb.simpleConnection(apiConfig.mongoServerUrl, function(db){
		var dbCollection = db.collection("albumInfo");

		dbCollection.find({}).toArray(function(err, docs){
			if (err) {
				apiUtils.sysErr(err);
			}

			var newResult = [];
			for (var i=0, len=docs.length; i<len; i++) {
				newResult.push({
					albumId : docs[i]._id,
					album : docs[i].album,
					artist : docs[i].artist
				});
			}

			resp.end(JSON.stringify(newResult));
		})
	});

}
