const fs = require('fs');
const database = require('./sqlite/db.js');

const db = new database(); // Starts the database connection for the handlers to use

var handlers = {
    default: function(request, response) { // This is where we will read the request, find the applicable file, and parse to insert anything from the database as needed
        var requestedFile = request.url != "/" ? request.url : "/index.html"; // Sets default page to index.html

        fs.readFile(__dirname + "/web" + requestedFile, function(err, data) {
            if (err) {
                console.error("Attempted serving \"" + request.url + "\" with error \"" + err + "\"");

                response.writeHead(404);
                response.end("<title>iTrakz Error: 404</title><h1 align='center'>404 - No noodles here!</h1>"); // 404 error if file not found
            } else {
                console.log("Serving " + __dirname + "/web" + requestedFile); // Debug
            }

            response.writeHead(200);
            response.end(data);
        })
    },

    dbTest: function(request, response) {
        response.writeHead(200);
        response.end(db.updateResponder("Zek", 2, ));
    }
}

module.exports = handlers; // Allows access to internal functions by NodeJS module.exports