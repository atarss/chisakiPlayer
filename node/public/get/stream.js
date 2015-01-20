// API : get/file.js
// By Andy 2014
var fs = require("fs");
var path = require("path");
var spawn = require('child_process').spawn;

exports.worker = function(req, resp, httpReq) {
	var query = req.query;
	if (query.id) {
		apiDb.getInfoFromId(query.id, function(res){
			if (res) {
				apiUtils.sysDebug(JSON.stringify(res));
				var filePath = res.fileName;
				if (fs.existsSync(filePath)) { // check file exists
					if (query.bitrate) {
						var br = parseInt(query.bitrate);
						if ((br >= 8 ) && (br <= 320) && (br % 8 == 0)) { // check bitrate
							//start to stream
							var tmpFileName = path.join(apiConfig.tmpFolder, (apiUtils.md5Hash(Date() + Math.random()) + ".mp3"));
							resp.writeHead(200, {'content-type' : 'audio/mpeg'});
							var newSpawn = spawn("lame", ["--mp3input", "-b"+br, filePath, tmpFileName]);
							// newSpawn.stdout.pipe(resp);
							
							newSpawn.on("close", function(){
								var readStream = fs.createReadStream(tmpFileName);
								readStream.pipe(resp);
							});

							httpReq.on("close", function(){
								newSpawn.kill();
							});

							httpReq.on("end", function(){
								newSpawn.kill();
							});
						} else {
							apiUtils.httpResponseErr({ illegal_bitrate : query.bitrate } , resp);
						}
					} else {
						var readStream = fs.createReadStream(filePath);
						readStream.pipe(resp);
					}
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
