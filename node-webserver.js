var http = require('http'); // Node HTTP handler
var handlers = require('./requestHandlers.js').data; // Imports functions from requestHandlers.js

const port = 8080; // default port is 80, but setting to secondary standard 8080. Prod systems should be set to 80

var server = http.createServer(handlers.default); // Sends incoming connections to requestHandlers.js
server.listen(port); // Starts server

console.log('Started server running on http://localhost:' + port);