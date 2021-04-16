const database = require('../sqlite/db.js');
let db = new database(); // Starts the database connection for the handlers to use
document.getElementById('ticketForm');
function fetchTickets() {
    const tickets = db.getOpenTickets();
    const ticketsList = document.getElementById('ticketList');

    if (tickets.length < 1) {
        ticketsList.innerHTML += '<h3>No Open Tickets</h3>';
        return;
    }

    ticketsList.innerHTML = '';
    for (let i = 0; i < tickets.length; i++) {
        const author = tickets[i].author;
        const title = tickets[i].title;
        const description = tickets[i].description;
        const label = tickets[i].label;
        const assignedTo = tickets[i].responder;

        ticketsList.innerHTML += '<tr class="ticket-indiv">' +
                                 '<td>' + author + '</td>' +
                                 '<td>1</td>' +
                                 '<td>' + title + '</td>' +
                                 '<td>' + description +'</td>' +
                                 '<td>' + label + '</td>' +
                                 '<td>' + assignedTo +'</td>' +
                                 '</tr>';
    }
}

function fetchHistory() {
    const history = db.getHistory();

    let historyList = document.getElementById('historyList');

    historyList.innerHTML = '';
    for (let i = 0; i < history.length; i++) {
        const date = history[i].date;
        const description = history[i].description;
        const user = history[i].user;

        //DONE
        historyList += '<div class="row">' +
                        '<div class="col-2 date">' +
                        '<p>' + date + '</p>' + '</div>' +
                        '<div class="col hist-description">' +
                        '<p>' + description + '</p>' + '</div>' +
                        '<div class="col-1 user">' +
                        '<p>' + user + '</p>' + '</div>' +
                        '<hr />' + '</div>';
    }
}

function getTotals() {
    const newTickets = db.checkNewOpenTickets();
    const inProgressTickets = db.checkInProgressTickets();

    //Done I think
    const openTickets = document.getElementById("new-open-tickets");
    openTickets.innerHTML += newTickets;

    const ipTickets = document.getElementById("ip-tickets");
    ipTickets.innerHTML += inProgressTickets;
}

//For Dashboard Ticket List, I think is correct if the main ticket list is correct as well
function dashboardTicketList() {
    const dashtickets = db.getOpenTickets();

    let dashTickList = document.getElementById('tickList');

    dashTickList.innerHTML = '';

    for(let i = 0; i < 2; i++) {
        const mainTitle = dashtickets[i].title;
        const dashdescription = dashtickets[i].description;

        dashTickList.innerHTML += '<p class="main-title">' + mainTitle + '</p>' +
                        '<p class="description">' + dashdescription + '</p>' +
                        '<hr />';
    }
}