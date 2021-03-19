var handlers = {
    default: function(request, response) { // This is where we will read the request, find the applicable file, and parse to insert anything from the database as needed
        console.log("Success!");
        response.writeHead(200);
        response.end("Success!");
    }
}
exports.data = handlers; // Allows access to internal functions by NodeJS module.exports