// API Configuration File.
// using it with apiConfig object.

var config = {
    mongoServerUrl : "mongodb://127.0.0.1:27017/musicLib",
    serverAddress : [ "0.0.0.0" , "::1" ],
    serverPort : 8000,
    indexFolder : "./public/",
    musicLibraryFolder : [
    	"/home/andy/library/"
    ]
}

exports.config = config;
