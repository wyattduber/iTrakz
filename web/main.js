const database = require('../sqlite/db.js');
let db = new database(); // Starts the database connection for the handlers to use

const el = document.getElementById('ticketForm');

function fetchTickets() {
    const tickets = db.getOpenTickets();
    const ticketsList = document.getElementById('ticketList');

    if (tickets.length < 1) {
        return; //TODO: Add HTML here for the case that there are no open tickets
    }

    ticketsList.innerHTML = '';
    for (let i = 0; i < tickets.length; i++) {
        const author = tickets[i].author;
        const title = tickets[i].title;
        const description = tickets[i].description;
        const label = tickets[i].label;
        const assignedTo = tickets[i].responder;

        ticketsList.innerHTML += '<div class="row ticket-indiv">' +
                                 '<div class="col-2">' + author + '</div>' +
                                 '<div class="col-1">1</div>' +
                                 '<div class="col-2">' + title + '</div>' +
                                 '<div class="col-3">' + description +'</div>' +
                                 '<div class="col-1">' + label + '</div>' +
                                 '<div class="col-2">' + assignedTo +'</div>' +
                                 '</div>';
    }

}

function fetchHistory() {
    const history = db.getHistory();

    const historyList = document.getElementById('historyList');

    historyList.innerHTML = '';
    for (let i = 0; i < history.length; i++) {
        const date = history[i].date;
        const description = history[i].description;
        const user = history[i].user;

        //TODO Make an HTML adder sequence like in the fetchTickets method above
    }


}

function getTotals() {
    const newTickets = db.checkNewOpenTickets();
    const inProgressTickets = db.checkInProgressTickets();
    //TODO Implement the HTML to change the numbers of each tickets
}