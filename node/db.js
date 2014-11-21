// database.js
// Database Driver for API
// Using mongodb as database backend.

var mongo = require("mongodb");
var BSON = mongo.BSONPure;
var defaultMongoAddress = apiConfig.mongoServerUrl;
var isWorking = false;

function checkIdLegal(idStr) {
	idStr = idStr.toUpperCase();
	if ((idStr.length==12) || (idStr.length==24)) {
		for (i in idStr){
			var c = idStr[i];
			if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'F')) {
				return true;
			} else {
				return false;
			}
		}
	} else {
		return false;
	}
}

var simpleConnection = function(mongoAddress, callback) {
	mongo.MongoClient.connect(mongoAddress, function(err, db){
		if (err) {
			apiUtils.sysErr("Error connecting to mongodb server. Daemon is down?");
		} else {
			callback(db);
		}
	});
}

var testAddress = function(mongoAddress) {
	simpleConnection(mongoAddress, function(db){
		apiUtils.sysLog("Test DB Server : Connection Success");
		defaultMongoAddress = mongoAddress;
		db.close();
	});
}

var insertDocumentsArray = function(collectionName, documentObjArr, callback) { // callback(result)
	simpleConnection(defaultMongoAddress, function(db){
		var dbCollection = db.collection(collectionName);
		dbCollection.insert(documentObjArr , function(err, result) {
			db.close();
			
			if (err) {
				apiUtils.sysErr(err);
			} else {
				if (callback) {
					callback(result);
				}
			}
		});
	});
}

var insertSingleDocument = function(collectionName, documentObj, callback) { // callback(result)
	insertDocumentsArray(collectionName, [documentObj], callback);
}

var dropCollection = function(collectionName, callback) {
	simpleConnection(defaultMongoAddress, function(db){
		var dbCollection = db.collection(collectionName);
		dbCollection.drop(function(err){
			db.close();

			if (err) {
				apiConfig.sysErr(err);
			}

			if (callback) {
				callback();
			}
		});
	});
}

var listCollection = function(collectionName, callback) {
	simpleConnection(defaultMongoAddress, function(db){
		var dbCollection = db.collection(collectionName);
		dbCollection.find({}).toArray(function(err, docs){
			db.close();

			if (err) {
				apiConfig.sysErr(err);				
			}

			if (callback) {
				callback(docs);
			}

		});
	});
}
			
//==============MUSIC LIBRARY OPERATION==================

var clearMusicLibrary = function(callback) {
	dropCollection("trackInfo", function(){
		dropCollection("albumInfo", function(){
			if (callback) {
				callback()
			}
		})
	})
}

var rebuildMusicLibrary = function(tagArr, callback) {
	simpleConnection(defaultMongoAddress, function(db){
		var dbCollection = db.collection("trackInfo");
		dbCollection.drop(function(){
			dbCollection.insert(tagArr, function(err, result){
				db.close();
				if (err) {
					apiUtils.sysErr(err);
				} else {
					if (callback) {
						callback(result);
					}
				}
			});
		});
	});
}

var showMusicLibraryInfo = function(callback) {
	simpleConnection(defaultMongoAddress, function(db){
		var dbCollection = db.collection("trackInfo");
		dbCollection.find({}, {duration : 1}). toArray(function(err, docs){
			db.close();
			if (err) {
				apiUtils.sysErr(err);
			} else {
				var totalTime = 0;
				for (i in docs) {
					if (! isNaN(parseInt(docs[i].duration))) {
						totalTime += docs[i].duration;
					}
				}

				if (callback) {
					callback({
						library : apiConfig.musicLibraryFolder,
						totalTime : totalTime
					});
				}
			}
		})
	});
}

var showMusicLibraryFull = function(callback) {
	listCollection("trackInfo", function(result){
		if (callback) {
			callback(result);
		}
	})
}

var showMusicLibrarySimple = function(callback) {
	simpleConnection(defaultMongoAddress, function(db){
		var dbCollection = db.collection("trackInfo");
		dbCollection.find({} , {
			_id : 1, 
			title : 1, 
			artist : 1, 
			album : 1, 
			albumId : 1,
			duration : 1
		}).toArray(function(err, docs){
			db.close();
			if (err) {
				apiUtils.sysErr(err);
			} else {
				if (callback) {
					callback(docs);
				}
			}
		});
	});
}


var showMusicLibraryId = function(callback) {
	simpleConnection(defaultMongoAddress, function(db){
		var dbCollection = db.collection("trackInfo");
		dbCollection.find({} , {_id : 1}).toArray(function(err, docs){
			db.close();
			if (err) {
				apiUtils.sysErr(err);
			} else {
				if (callback) {
					callback(docs);
				}
			}
		});
	});
}

var getInfoFromId = function(trackId, callback) {
	if (checkIdLegal(trackId+"")) {
		var tmp_id = new BSON.ObjectID(trackId);
		simpleConnection(defaultMongoAddress, function(db){
			var dbCollection = db.collection("trackInfo");
			dbCollection.findOne({_id : tmp_id}, function(err, doc){
				db.close();

				if (err) {
					apiUtils.sysErr(err);
				} else {
					if (callback) {
						callback(doc);
					}
				}
			});
		});
	} else {
		callback(null);
	}
}

// ================== ALBUM OPERATION ====================

var insertAlbumArr = function(albumArr, callback) {
	insertDocumentsArray("albumInfo", albumArr, function(result){
		if (callback) {
			callback(result);
		}
	})
}

var rebuildAlbumLibrary = function(albumArr, callback) {
	dropCollection("albumInfo", function(){
		insertAlbumArr(albumArr, function(result){
			if (callback) {
				callback(result);
			}
		})
	})
}

var getAlbumInfo = function(albumIdStr, callback) {
	if (checkIdLegal(albumIdStr)){
		simpleConnection(defaultMongoAddress, function(db){
			var dbCollection = db.collection("albumInfo");

			var albumIdObj = new BSON.ObjectID(albumIdStr);
			dbCollection.findOne({_id : albumIdObj}, function(err, doc){
				if (err) {
					apiUtils.sysErr(err);
				}

				db.collection("trackInfo").find({albumId : albumIdObj}, {
					_id : 1,
					title : 1
				}). toArray(function(err, docs){
					db.close();

					if (err) {
						apiUtils.sysErr(err);
					}

					var trackArr = [];
					for (var i=0, len=docs.length; i<len; i++) {
						trackArr.push({
							trackId : docs[i]._id,
							title : docs[i].title
						});
					}
					doc.tracks = trackArr;

					if (callback) {
						callback(doc);
					}
				});
			});
		});
	} else {
		if (callback) {
			callback();
		}
	}
}

var getAlbumList = function(callback) {
	simpleConnection(defaultMongoAddress, function(db){
		var dbCollection = db.collection("albumInfo");

		dbCollection.find({}).toArray(function(err, docs){
			if (err) {
				apiUtils.sysErr(err);
			}

			if (callback) {
				callback(docs);
			}
		})
	})
}

// ================== export result ======================

exports.mongo = mongo;
exports.simpleConnection = simpleConnection;
exports.testAddress = testAddress;
exports.insertSingleDocument = insertSingleDocument;

exports.getInfoFromId = getInfoFromId;

exports.clearMusicLibrary = clearMusicLibrary;
exports.rebuildMusicLibrary = rebuildMusicLibrary;
exports.showMusicLibraryInfo = showMusicLibraryInfo;
exports.showMusicLibraryId = showMusicLibraryId;
exports.showMusicLibrarySimple = showMusicLibrarySimple;
exports.showMusicLibraryFull = showMusicLibraryFull;

exports.insertAlbumArr = insertAlbumArr;
exports.getAlbumInfo = getAlbumInfo;
exports.getAlbumList = getAlbumList;
