// API Configuration File.
// using it with apiConfig object.

var config = {
    mongoServerUrl : "mongodb://127.0.0.1:27017/musicLib",
    serverAddress : "127.0.0.1",
    serverPort : 8000,
    indexFolder : "./public/",
    musicLibraryFolder : [
    	"/run/media/andy/9868B60F68B5EBDE/mp3lib/"
    ]
}

exports.config = config;
