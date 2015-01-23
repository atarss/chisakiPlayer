var server = require("api/api.js");

var api  = new server();
api.bindWorker("/", function(httpResp){
    httpResp.end("Hello, World~");
});

api.startServer(18000, "0.0.0.0");