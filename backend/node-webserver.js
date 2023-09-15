/* Import libraries */
const http = require('http'); // Node HTTP handler
const handlers = require('./requestHandlers.js'); // Imports functions from requestHandlers.js

/* Start server */
var server = http.createServer(handlers.default); // Sends incoming connections to requestHandlers.js
const port = 8090; // default port is 80, but setting to secondary standard 8080. Prod systems should be set to 80
server.listen(port); // Starts server

console.log('Started server running on http://localhost:' + port);
