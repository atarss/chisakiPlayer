// API : get/file.js
// By Andy 2014
var fs = require("fs");

exports.worker = function(req, resp) {
	var query = req.query;
	if (query.id) {
		apiDb.getInfoFromId(query.id, function(res){
			var filePath = res.fileName;
			var readStream = fs.createReadStream(filePath);

			readStream.pipe(resp);
		});
	} else {
		resp.end(JSON.stringify({
			error : {
				missing_argument : "id"
			}
		}));
	}
}
