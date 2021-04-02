const db = require('better-sqlite3')('database.db'); // import sqlite

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
        let stmt = db.prepare('CREATE TABLE IF NOT EXISTS tickets(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
            'title VARCHAR(200) NOT NULL, ' +
            'author VARCHAR(50) NOT NULL, ' +
            'time DATETIME NOT NULL, ' +
            'content LONGTEXT NOT NULL, ' +
            'label VARCHAR(20) NOT NULL, ' +
            'projectTitle VARCHAR(50), ' +
            'responder VARCHAR(50), ' +
            'category VARCHAR(20)' +
            ');');
        stmt.run();

        stmt = db.prepare('CREATE TABLE IF NOT EXISTS history(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
            'date DATETIME NOT NULL, ' +
            'description VARCHAR(200) NOT NULL, ' +
            'user VARCHAR(50) NOT NULL' +
            ');');
        stmt.run();

        console.log("Opened database");
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
     * @param label
     * @returns {[]}
     */
    getTicketsByLabel(label) {
        let stmt = db.prepare("SELECT id FROM tickets WHERE label=?");
        let ids = stmt.all(label);
        let returnArr = [];

        for (let i = 0; i < ids.length; i++) {
            returnArr.push(ids[i]["id"]);
        }

        return returnArr;
    }

    /**
     * Updates the project title attribute of the ticket
     * @param newProjectTitle
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    updateProjectTitle(newProjectTitle, id, user) {
        let stmt = db.prepare("UPDATE tickets SET projectTitle=? WHERE id=?");
        stmt.run(newProjectTitle, id);

        this.createHistory("Project Update - " + newProjectTitle, user);
    }

    /**
     * Updates the Responder of the ticket if someone responds to it or deletes their response
     * @param responder
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    updateResponder(responder, id, user) {
        let stmt = db.prepare("UPDATE tickets SET responder=? WHERE id=?");
        stmt.run(responder, id);

        this.createHistory("Ticket Response", user);
    }

    /**
     * Updates the category of the ticket
     * @param newCategory
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    updateCategory(newCategory, id, user) {
        let stmt = db.prepare("UPDATE tickets SET category=? WHERE id=?");
        stmt.run(newCategory, id);

        this.createHistory("Category Update - " + newCategory, user);
    }

    /**
     * Updates the label of the ticket
     * @param newLabel
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    updateLabel(newLabel, id, user) {
        let stmt = db.prepare("UPDATE tickets SET label=? WHERE id=?");
        stmt.run(newLabel, id);

        this.createHistory("Label Change - " + newLabel, user);
    }

    /**
     * Updates the content of the ticket with a new string
     * @param newContent
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    updateContent(newContent, id, user) {
        let stmt = db.prepare("UPDATE tickets SET content=? WHERE id=?");
        stmt.run(newContent, id);

        this.createHistory("Content Edit", user);
    }

    /**
     * Updates the title of the ticket
     * @param newTitle
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    updateTitle(newTitle, id, user) {
        let stmt = db.prepare("UPDATE tickets SET title=? WHERE id=?");
        stmt.run(newTitle, id);

        this.createHistory("Title Change - " + newTitle, user);
    }

    /**
     * Creates a new ticket row in the database upon the creation of a ticket on the website
     * @param id
     * @param title
     * @param author
     * @param time
     * @param content
     * @param label
     * @param projectTitle
     * @param responder
     * @param category
     * @returns {Generator<*, void, *>}
     */
    createTicket(id, title, author, content, label, projectTitle, responder, category) {
        let stmt = db.prepare("INSERT INTO tickets(id,title,author,content,label,projectTitle,responder,category) VALUES (?,?,?,date('now'),?,?,?,?,?)");
        stmt.run(id, title, author, content, label, projectTitle, responder, category);

        this.createHistory("Opened Ticket", author);
    }

    /**
     * Creates a new history row in the database for any creation or update event
     * @param date
     * @param description
     * @param user
     * @returns {Generator<*, void, *>}
     */
    createHistory(description, user) {
        let stmt = db.prepare("INSERT INTO history(date,description,user) VALUES (date('now'),?,?)");
        stmt.run(description, user);
    }
}

module.exports = database;