// main.js
// Starting point for API
// by Andy 2014
var log4js = require('log4js');
var log = log4js.getLogger();
global.log = log;
log.debug("Test Debug");
log.info("Test Info");
log.error("Test Error");
log.warn("Test Warning");

var apiUtils = require("./utils.js");
global.apiUtils = apiUtils;
apiUtils.sysLog("Utils Loaded");
apiUtils.registerSigint();

// inner lib required.
var processQueue = require("./processQueue.js").processQueue;
global.processQueue = processQueue;
var mainConfigObj = require("./config.js").config;
global.apiConfig = mainConfigObj;
apiUtils.sysLog("Configuration File Loaded ('config.js')");

var apiDb = require("./db.js");
apiDb.testAddress(mainConfigObj.mongoServerUrl);
global.apiDb = apiDb;
apiUtils.sysLog("Database Driver Loaded.");
apiUtils.sysLog("Mongodb URI: " + apiConfig.mongoServerUrl);

var apiFrame = require("./api.js");
apiFrame.listen(apiConfig.serverAddress, apiConfig.serverPort);
apiUtils.sysLog("HTTP Server Ready.");
