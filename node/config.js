// API Configuration File.
// using it with apiConfig object.

var config = {
    mongoServerUrl : "mongodb://127.0.0.1:27017/musicLib",
    serverAddress : [ "::" ],
    serverPort : 8000,
    indexFolder : "./public/",
    musicLibraryFolder : [
    	"/home/andy/library/"
    ],
    tmpFolder : "/home/andy/tmp/"
}

exports.config = config;
