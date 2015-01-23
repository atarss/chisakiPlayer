var http = require('http');
var path = require('path');
var url = require('url');
var formidable = require('formidable');

var Server = function() {
    this.apiList = {};
    this.serverHost = undefined;
    this.serverPort = undefined;
    this.uploadPath = undefined;
};

Server.prototype.listener = function(httpReq, httpResp) {
    var urlPath = url.parse(httpReq.url).pathname;
    var apiList = this.apiList;
    if (apiList[urlPath]) {
        // Parse HTTP request here
        if (httpReq.method.toLowerCase() == "post"){
            //Parse form using formidable
            var form = new formidable.IncomingForm();
            form.parse(httpReq, function(err, fields, files) {
                if (err) {
                    //TODO: Handle Error Here
                    // httpResp.end("Error");
                    httpResp.end(JSON.stringify(err));
                    return;
                }

                apiList[urlPath].worker(httpResp, {
                    query : fields,
                    file : files
                }, httpReq);
            });
        } else {
            // Assuming "GET" method
            var queryObj = urlParser(req.url, true).query;
            apiList[urlPath].worker(httpResp, {
                query : queryObj
            }, httpReq);
        }
    }
};

Server.prototype.bindWorker = function(pathStr, workerFunc) {
    if (workerFunc) {
        this.apiList[pathStr].worker = workerFunc;
    }
};

Server.prototype.bindToRawFile = function(pathStr, rawFilePath) {
    this.bindWorker(pathStr, function(queryObj, httpReq, httpResp) {
        fs.readFile(rawFilePath, function(err, data){
            if (err) {
                // httpResp.end("Error");
                httpResp.end(JSON.stringify(err));
                return;
            }

            httpResp.end(data);
        });
    });
};

Server.prototype.startServer = function(port, host) {
    this.serverHost = host;
    this.serverPort = port;
    http.createServer(this.listener).listen(port, host);
};

module.exports = Server;