// API : get/image.js
// By Andy 2014
// return album image of an mp3 file

var fs = require("fs");
var mm = require("musicmetadata");

exports.worker = function(req, resp, httpReq) {
	var query = req.query;
	if (query.id) {
		apiDb.getInfoFromId(query.id, function(res){
			if (res) {
				var filePath = res.fileName;
				if (fs.existsSync(filePath)) { // check file exists
					var fileStream = fs.createReadStream(filePath) 
					var parser = mm(fileStream);

					parser.on('metadata', function(result){
						fileStream.destroy();

						if (result.picture) {
							if (result.picture[0].format == "jpg") {
								resp.writeHead(200, { 'content-type' : 'image/jpeg'	});
							}
							resp.end(result.picture[0].data);
						} else {
							apiUtils.httpResponseErr({image_not_exist : filePath} , resp);
						}

					});
				} else {
					// error : file not exist
					apiUtils.httpResponseErr({file_not_exist : filePath} , resp);
				}
			} else {
				// error : ID illegal
				apiUtils.httpResponseErr({illegal_id : query} , resp);
			}
		});
	} else {
		apiUtils.httpResponseErr({ missing_argument : "id" }, resp);
	}
}
