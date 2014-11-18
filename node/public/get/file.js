// API : get/file.js
// By Andy 2014
var fs = require("fs");
var spawn = require('child_process').spawn;

exports.worker = function(req, resp, httpReq) {
	var query = req.query;
	if (query.id) {
		apiDb.getInfoFromId(query.id, function(res){
			if (res) {
				var filePath = res.fileName;
				if (query.bitrate) {
					var br = parseInt(query.bitrate);
					if ((br >= 8 ) && (br <= 320) && (br % 8 == 0)) {
						//start to stream
						var newSpawn = spawn("lame", ["--mp3input", "-b"+br, filePath, "-"]);
						newSpawn.stdout.pipe(resp);

						httpReq.on("close", function(){
							newSpawn.kill();
						});
					} else {
						resp.end(JSON.stringify({
							error : {
								illegal_bitrate : query.bitrate
							}
						}));
					}
				} else {
					var readStream = fs.createReadStream(filePath);
					readStream.pipe(resp);
				}
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
