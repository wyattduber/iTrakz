const fs = require('fs');
const database = require('./sqlite/db.js');

const db = new database(); // Starts the database connection for the handlers to use

var handlers = {
    default: function(request, response) { // This is where we will read the request, find the applicable file, and parse to insert anything from the database as needed
        var requestedFile = request.url != "/" ? request.url : "/index.html"; // Sets default page to index.html

        /* FIXME:
         - Read the requestedFile and figure out which page it's asking for
         - Based on which page it's asking for, create and call a new handler
         - In each handler, call the database object (see dbTest for examples) to find all the info needed for that specific page
         - Send the page to the client with response.write()
         - Before ending the connection, also write() a new string containing a `<script>` tag with all the JS needed to
           substitute the values obtained from the database into the HTML doc using `"document.getElementById('stuff').innerHTML = " + varFromDatabase;`
         */

        fs.readFile(__dirname + "/web" + requestedFile, function(err, data) {
            if (err) {
                console.error("Attempted serving \"" + request.url + "\" with error \"" + err + "\"");

                response.writeHead(404);
                response.end("<title>iTrakz Error: 404</title><h1 align='center'>404 - No noodles here!</h1>"); // 404 error if file not found
                return
            } else {
                console.log("Serving " + __dirname + "/web" + requestedFile); // Debug
            }

            let jsFromHandler = ""; // This will be filled in by the appropriate request handler and added to the end of the page
            switch(requestedFile.toString()) {
                case "/index.html":
                    jsFromHandler = handlers.homepage();
                    break;
                case "/tickets.html":
                    jsFromHandler = handlers.tickets();
                    break;
            }

            response.writeHead(200);
            response.write(data + "\n" + jsFromHandler);
            response.end();
        })
    },

    homepage: function() {
        return ""; // TODO pull stuff from database and insert as <script> tag here
    },

    tickets: function() {
        return ""; // TODO pull stuff from database and insert as <script> tag here
    },

    dbTest: function(request, response) {
        db.createTicket("testTicketTitle", "testAuthor", "testContent", "testLabel", "testResponder","testCategory");
        console.log("Ticket created");
        db.updateTitle("newTicketTitle", 1, "zek");
        console.log("Title updated");
        db.updateContent("newContent", 1, "zek");
        console.log("Content updated");
        db.updateLabel("newLabel", 1, "zek");
        console.log("Label updated");
        db.updateCategory("newCategory", 1, "zek");
        console.log("Category updated");
        db.updateResponder("zekResponder", 1, "zek");
        console.log("Responder updated");
        let tmp = db.getTicketsByLabel("newLabel");
        console.log("Should print 1: " + tmp.toString());
        tmp = db.getTicketsByAuthor("testAuthor");
        console.log("Should print 1: " + tmp.toString());
        tmp = db.getTicketById(1);
        console.log("Should print whole ticket:\n" + JSON.stringify(tmp));
        tmp = db.getHistoryBit(1, "description");
        console.log("Should print createTicket history desc: " + tmp.toString());
        tmp = db.getTicketBit(1, "title");
        console.log("Should print ticket title: " + tmp.toString());

        response.writeHead(200);
        response.end("oh yuh, it worked; see console");
    }
}

module.exports = handlers; // Allows access to internal functions by NodeJS module.exports