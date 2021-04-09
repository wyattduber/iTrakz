var el = document.getElementById('ticketForm');
if(el) {
    el.addEventListener('submit', saveTicket);
}


function saveTicket(e) {
    var ticketDesc = document.getElementById('description').value;
    var ticketSubject = document.getElementById('subject').value;
    var ticketRequester = document.getElementById('requester').value;
    var ticketPriority = document.getElementById('priority').value;
    var ticketAssignedTo = document.getElementById('assigned-to').value;

    var ticket = {
        requester: ticketRequester,
        subject: ticketSubject,
        description: ticketDesc,
        priority: ticketPriority,
        assignedTo: ticketAssignedTo
    }

    if(localStorage.getItem('tickets') === null) {
        var tickets = [];
        tickets.push(ticket);
        localStorage.setItem('tickets', JSON.stringify(tickets));
    } else {
        var tickets = JSON.parse(localStorage.getItem('tickets'));
        tickets.push(ticket);
        localStorage.setItem('tickets', JSON.stringify(tickets));
    }

    document.getElementById('ticketForm').reset();

    fetchTickets();

    e.preventDefault();
}

function fetchTickets() {
    var tickets = JSON.parse(localStorage.getItem('tickets'));
    var ticketsList = document.getElementById('ticketList');

    ticketsList.innerHTML = '';
   //if(tickets) {
        for(var i = 0; i < tickets.length; i++) {
        var requester = tickets[i].requester;
        var subject = tickets[i].subject;
        var description = tickets[i].description;
        var priority = tickets[i].priority;
        var assignedTo = tickets[i].assignedTo;

        ticketsList.innerHTML += '<div class="row ticket-indiv">' +
                                '<div class="col-2">' + requester + '</div>' +
                                '<div class="col-1">1</div>' +
                                '<div class="col-2">' + subject + '</div>' +
                                '<div class="col-3">' + description +'</div>' +
                                '<div class="col-1">' + priority + '</div>' +
                                '<div class="col-2">' + assignedTo +'</div>' +
                                '</div>';
    }
    //}
    

}