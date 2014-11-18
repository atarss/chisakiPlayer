// database.js
// Database Driver for API
// Using mongodb as database backend.

var mongo = require("mongodb");
var defaultMongoAddress = apiConfig.mongoServerUrl;
var isWorking = false;

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

//==============MUSIC LIBRARY OPERATION==================

var clearMusicLibrary = function(callback) {
	simpleConnection(defaultMongoAddress, function(db){
		var dbCollection = db.collection("musicLibrary");
		dbCollection.drop();
		db.close();
		callback();
	})
}

var rebuildMusicLibrary = function(tagArr, callback) {
	simpleConnection(defaultMongoAddress, function(db){
		var dbCollection = db.collection("musicLibrary");
		dbCollection.drop();
		dbCollection.insert(tagArr, function(err, result){
			db.close();
			if (err) {
				apiUtils.sysErr(err);
			} else {
				if (callback) {
					callback();
				}
			}
		});
		// callback();
	});
}

var showMusicLibrary = function(callback) {
	simpleConnection(defaultMongoAddress, function(db){
		var dbCollection = db.collection("musicLibrary");
		dbCollection.find().toArray(function(err, docs){
			db.close();
			if (err) {
				apiUtils.sysErr(err);
			} else {
				if (callback) {
					callback(docs);
				}
			}
		})
	});
}

exports.mongo = mongo;
exports.simpleConnection = simpleConnection;
exports.testAddress = testAddress;
exports.insertSingleDocument = insertSingleDocument;

exports.clearMusicLibrary = clearMusicLibrary;
exports.rebuildMusicLibrary = rebuildMusicLibrary;
exports.showMusicLibrary = showMusicLibrary;