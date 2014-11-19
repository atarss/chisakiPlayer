// API Configuration File.
// using it with apiConfig object.

var config = {
    mongoServerUrl : "mongodb://127.0.0.1:27017/musicLib",
<<<<<<< HEAD
    serverAddress : "0.0.0.0",
    ipv6ServerAddress : "ipv6.atarss.com",
=======
    serverAddress : [ "0.0.0.0" , "::1" ],
>>>>>>> 375a0dbbd5e1f7f2e85a8d2fc5feccf2374774ce
    serverPort : 8000,
    indexFolder : "./public/",
    musicLibraryFolder : [
    	"/home/andy/library/"
    ]
}

exports.config = config;
