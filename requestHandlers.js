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
           substitute the values obtained from the database into the HTML doc using `"document.getElementById('stuff').innerHTML = " + varFromDatabase;
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
        //Initialize the Script
        let homePageCode = "<script>\n";

        //Open Tickets Circle
        const totalOpenTickets = db.checkNewOpenTickets();
        homePageCode += "let openCircle = document.getElementById(\'new-open-tickets\');\n";
        homePageCode += "openCircle.innerHTML += \"" + totalOpenTickets + "\";\n";

        //In Progress Tickets Circle
        const totalIPTickets = db.checkInProgressTickets();
        homePageCode += "let ipCircle = document.getElementById(\'ip-tickets\');\n";
        homePageCode += "ipCircle.innerHTML += \"" + totalIPTickets + "\";\n";

        //History Table
        const historyItems = db.getHistory();
        homePageCode += "let historyList = document.getElementById(\'historyList\');\n";
        if (historyItems.length < 1) {
            homePageCode += "table.innerHTML = \'<h3>No History Items</h3>\';\n";
        }
        homePageCode += "let row;\n";
        for (let i = 0; i < 5; i++) {
            homePageCode += "row = historyList.insertRow(" + (i) + ");\n";
            homePageCode += "row.insertCell(0).innerHTML = \"" + historyItems[i].date + "\";\n";
            homePageCode += "row.insertCell(1).innerHTML = \"" + historyItems[i].description + "\";\n";
            homePageCode += "row.insertCell(2).innerHTML = \"" + historyItems[i].user + "\";\n";
        }

        homePageCode += "</script>\n";
        return homePageCode;
    },

    tickets: function() {
        const tickets = db.getOpenTickets();
        let ticketsList = "<script>\n";
        ticketsList += "let table = document.getElementById(\'ticketList\');\n";

        if (tickets.length < 1) {
            ticketsList += "table.innerHTML = \'<h3>No Open Tickets</h3>\';\n";
        }

        ticketsList += "let row;\n";
        for (let i = 0; i < tickets.length; i++) {
            let responder = "None";
            if (tickets[i].responder !== null) {
                responder = tickets[i].responder;
            }
            ticketsList += "row = table.insertRow(" + (i) + ");\n";
            ticketsList += "row.insertCell(0).innerHTML = \"" + tickets[i].author + "\";\n";
            ticketsList += "row.insertCell(1).innerHTML = \"" + tickets[i].id + "\";\n";
            ticketsList += "row.insertCell(2).innerHTML = \"" + tickets[i].title + "\";\n";
            ticketsList += "row.insertCell(3).innerHTML = \"" + tickets[i].description + "\";\n";
            ticketsList += "row.insertCell(4).innerHTML = \"" + tickets[i].status + "\";\n";
            ticketsList += "row.insertCell(5).innerHTML = \"" + responder + "\";\n";
        }

        ticketsList += "</script>\n";
        return ticketsList;
    },

    dbTest: function(request, response) {
        db.createTicket("testTicketTitle", "testAuthor", "testContent", "testStatus", "testResponder","testCategory");
        console.log("Ticket created");
        db.updateTitle("newTicketTitle", 1, "zek");
        console.log("Title updated");
        db.updateContent("newContent", 1, "zek");
        console.log("Content updated");
        db.updateStatus("newStatus", 1, "zek");
        console.log("Status updated");
        db.updateCategory("newCategory", 1, "zek");
        console.log("Category updated");
        db.updateResponder("zekResponder", 1, "zek");
        console.log("Responder updated");
        let tmp = db.getTicketsByStatus("newStatus");
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