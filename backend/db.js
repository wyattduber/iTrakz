const db = require('better-sqlite3')('./database.db'); // import sqlite

/**
 * Database Handler Class designed to handle all tickets and history objects needed for the website
 *
 * @author Wyatt Duberstein
 */
class database {

    /**
     * Constructor of the class and the database
     * Creates the tickets and the history table if they don't already exist
     */
    constructor() {
        let stmt = db.prepare('CREATE TABLE IF NOT EXISTS history(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
            'date DATETIME NOT NULL, ' +
            'description VARCHAR(200) NOT NULL, ' +
            'user VARCHAR(50) NOT NULL' +
            ');');
        stmt.run();

        stmt = db.prepare('CREATE TABLE IF NOT EXISTS tickets(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
            'title VARCHAR(200) NOT NULL, ' +
            'author VARCHAR(50) NOT NULL, ' +
            'time DATETIME NOT NULL, ' +
            'description VARCHAR(100) NOT NULL,' +
            'content LONGTEXT NOT NULL, ' +
            'status VARCHAR(20) NOT NULL, ' +
            'responder VARCHAR(50), ' +
            'category VARCHAR(20),' +
            'lastHistoryEvent INTEGER,' +
            'FOREIGN KEY(lastHistoryEvent) REFERENCES history(id)' +
            ');');
        stmt.run();

        console.log("Opened database");
    }

    /**
     * Returns the amount of new tickets currently in the system.
     * @returns {*}
     */
    checkNewOpenTickets() {
        let stmt = db.prepare("SELECT * FROM tickets WHERE status='New'");

        return stmt.all().length;
    }

    /**
     * Returns all of the open In Progress tickets currently in the system
     * @returns {*}
     */
    checkInProgressTickets() {
        let stmt = db.prepare("SELECT * FROM tickets WHERE status='In Progress'");

        return stmt.all().length;
    }

    /**
     * Returns all of the open new tickets currently in the system
     * @returns {*}
     */
    getOpenTickets() {
        let stmt = db.prepare("SELECT * FROM tickets");

        return stmt.all();
    }

    /**
     * Returns the specific part of the ticket, in string form
     * @param id
     * @param bit
     * @returns {Generator<*, void, *>}
     */
    getTicketBit(id, bit) {
        // Prepares statement, selects all values
        let stmt = db.prepare("SELECT * FROM tickets WHERE id=?");

        // Returns statement with inserted `id`, selecting `bit` specifically
        return stmt.get(id)[bit];
    }

    /**
     *
     * @param id
     * @param bit
     * @returns {Generator<*, void, *>}
     */
    getHistoryBit(id, bit) {
        let stmt = db.prepare("SELECT * FROM history WHERE id=?");

        return stmt.get(id)[bit];
    }

    /**
     * Returns the entire ticket in a string array
     * Each element of the array is an element of the ticket in the order of the db creation
     * @param id
     * @returns {Generator<*, void, *>}
     */
    getTicketById(id) {
        let stmt = db.prepare("SELECT * FROM tickets WHERE id=?");

        return stmt.get(id);
    }

    /**
     * Returns the id's of all the tickets by the specified author
     * @param author
     * @returns {[]}
     */
    getTicketsByAuthor(author) {
        let stmt = db.prepare("SELECT id FROM tickets WHERE author=?");
        let ids = stmt.all(author);
        let returnArr = [];

        for (let i = 0; i < ids.length; i++) {
            returnArr.push(ids[i]["id"]);
        }

        return returnArr;
    }

    /**
     * Gets all tickets by id categorized by their respective labels
     * @param status
     * @returns {[]}
     */
    getTicketsByStatus(status) {
        let stmt = db.prepare("SELECT id FROM tickets WHERE status=?");
        let ids = stmt.all(status);
        let returnArr = [];

        for (let i = 0; i < ids.length; i++) {
            returnArr.push(ids[i]["id"]);
        }

        return returnArr;
    }

    /**
     * Updates the Responder of the ticket if someone responds to it or deletes their response
     * @param responder
     * @param id
     * @param user
     * @returns {Generator<*, void, *>}
     */
    updateResponder(responder, id, user) {
        let stmt = db.prepare("UPDATE tickets SET responder=? WHERE id=?");
        stmt.run(responder, id);

        this.createHistory("Ticket Response", user, id);
    }

    /**
     * Updates the category of the ticket
     * @param newCategory
     * @param id
     * @param user
     * @returns {Generator<*, void, *>}
     */
    updateCategory(newCategory, id, user) {
        let stmt = db.prepare("UPDATE tickets SET category=? WHERE id=?");
        stmt.run(newCategory, id);

        this.createHistory("Category Update - " + newCategory, user, id);
    }

    /**
     * Updates the label of the ticket
     * @param newLabel
     * @param id
     * @param user
     * @returns {Generator<*, void, *>}
     */
    updateStatus(newStatus, id, user) {
        let stmt = db.prepare("UPDATE tickets SET status=? WHERE id=?");
        stmt.run(newStatus, id);

        this.createHistory("Label Change - " + newStatus, user, id);
    }

    /**
     * Updates the content of the ticket with a new string
     * @param newContent
     * @param id
     * @param user
     * @returns {Generator<*, void, *>}
     */
    updateContent(newContent, id, user) {
        let stmt = db.prepare("UPDATE tickets SET content=? WHERE id=?");
        stmt.run(newContent, id);

        this.createHistory("Content Edit", user, id);
    }

    /**
     * Updates the title of the ticket
     * @param newTitle
     * @param id
     * @param user
     * @returns {Generator<*, void, *>}
     */
    updateTitle(newTitle, id, user) {
        let stmt = db.prepare("UPDATE tickets SET title=? WHERE id=?");
        stmt.run(newTitle, id);

        this.createHistory("Title Change - " + newTitle, user, id);
    }

    /**
     * Creates a new ticket row in the database upon the creation of a ticket on the website
     * @param title
     * @param author
     * @param content
     * @param label
     * @param projectTitle
     * @param responder
     * @param category
     * @returns {Generator<*, void, *>}
     */
    createTicket(title, author, content, status, responder, category) {
        let description = content.substring(0, 49);
        description += '...';

        let stmt = db.prepare("INSERT INTO tickets(title,author,time,description,content,status,responder,category) VALUES (?,?,datetime('now'),?,?,?,?,?)");
        stmt.run(title, author, description, content, status, responder, category);

        stmt = db.prepare("SELECT id FROM tickets WHERE title=? AND author=? AND content=? ORDER BY id DESC LIMIT 1");
        let idOfTicket = stmt.get(title, author, content)['id'];

        this.createHistory("Opened Ticket", author, idOfTicket);
    }

    getHistory() {
        let stmt = db.prepare("SELECT * FROM history ORDER BY id DESC LIMIT 6");

        return stmt.all();
    }

    /**
     * Creates a new history row in the database for any creation or update event
     * @param description
     * @param user
     * @param idOfTicket
     * @returns {Generator<*, void, *>}
     */
    createHistory(description, user, idOfTicket) {
        let stmt = db.prepare("INSERT INTO history(date,description,user) VALUES (datetime('now'),?,?)");
        stmt.run(description, user);

        stmt = db.prepare("SELECT id FROM history WHERE description=? AND user=? ORDER BY id DESC LIMIT 1");
        let idOfHistory = stmt.get(description, user)['id'];

        stmt = db.prepare("UPDATE tickets SET lastHistoryEvent=? WHERE id=?");
        stmt.run(idOfHistory, idOfTicket)
    }
}

module.exports = database;