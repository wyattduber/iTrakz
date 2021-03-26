let db; // Initialize Database Variable
const sqlite3 = require('sqlite3'); // import sqlite

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
            db = new sqlite3.Database('database.db');
            console.log("Opened database");
            db.serialize(() => {
                db.run('CREATE TABLE IF NOT EXISTS tickets(' +
                    'id INT NOT NULL, ' +
                    'title VARCHAR(200) NOT NULL, ' +
                    'author VARCHAR(50) NOT NULL, ' +
                    'time DATETIME NOT NULL, ' +
                    'content LONGTEXT NOT NULL, ' +
                    'label VARCHAR(20) NOT NULL, ' +
                    'projectTitle VARCHAR(50), ' +
                    'responder VARCHAR(50), ' +
                    'category VARCHAR(20)' +
                    ');');
                db.run('CREATE TABLE IF NOT EXISTS history(' +
                    'id INT NOT NULL, ' +
                    'date DATETIME NOT NULL, ' +
                    'description VARCHAR(200) NOT NULL, ' +
                    'user VARCHAR(50) NOT NULL' +
                    ');');
            })
    }

    /**
     * Returns the specific part of the ticket, in string form
     * @param id
     * @param bit
     * @returns {Generator<*, void, *>}
     */
    *getTicketBit(id, bit) {
        try {
            db.transaction(function (tx) {
                switch (bit) {
                    case "title":
                        tx.executeSql('SELECT title FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                            return resultSet.rows.item(0).text;
                        });
                        break;
                    case "author":
                        tx.executeSql('SELECT author FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                            return resultSet.rows.item(0).text;
                        });
                        break;
                    case "time":
                        tx.executeSql('SELECT time FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                            return resultSet.rows.item(0).text;
                        });
                        break;
                    case "content":
                        tx.executeSql('SELECT content FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                            return resultSet.rows.item(0).text;
                        });
                        break;
                    case "label":
                        tx.executeSql('SELECT label FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                            return resultSet.rows.item(0).text;
                        });
                        break;
                    case "projectName":
                        tx.executeSql('SELECT projectName FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                            return resultSet.rows.item(0).text;
                        });
                        break;
                    case "responder":
                        tx.executeSql('SELECT responder FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                            return resultSet.rows.item(0).text;
                        });
                        break;
                    case "category":
                        tx.executeSql('SELECT name FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                            return resultSet.rows.item(0).text;
                        });
                        break;
                    default:
                        throw new SQLException();
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @param id
     * @param bit
     * @returns {Generator<*, void, *>}
     */
    *getHistoryBit(id, bit) {
        try {
            db.transaction(function (tx) {
                switch (bit) {
                    case "date":
                        tx.executeSql('SELECT date FROM history WHERE id=?', [id], function (tx, resultSet) {
                            return resultSet.rows.item(0).text;
                        });
                        break;
                    case "description":
                        tx.executeSql('SELECT description FROM history WHERE id=?', [id], function (tx, resultSet) {
                            return resultSet.rows.item(0).text;
                        });
                        break;
                    case "user":
                        tx.executeSql('SELECT user FROM history WHERE id=?', [id], function (tx, resultSet) {
                            return resultSet.rows.item(0).text;
                        });
                        break;
                    default:
                        throw new SQLException();
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Returns the entire ticket in a string array
     * Each element of the array is an element of the ticket in the order of the db creation
     * @param id
     * @returns {Generator<*, void, *>}
     */
    *getTicketById(id) {
        let i, arr;
        try {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM tickets WHERE id=?', [id], function (tx, results) {
                    arr = [results.rows.length];
                    for (i = 0; i < results.rows.length; i++) {
                        arr[i] = results.rows.item(i).text;
                    }
                    return arr;
                });
            });

        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Returns the id's of all the tickets by the specified author
     * @param author
     * @returns {Generator<*, void, *>}
     */
    *getTicketsByAuthor(author) {
        try {
            db.transaction(function (tx) {
                tx.executeSql('SELECT id FROM tickets WHERE author=?', [author], function (tx, results) {
                    let i, arr = [results.rows.length];
                    for (i = 0; i < results.rows.length; i++) {
                        arr[i] = results.rows.item(i).text;
                    }
                    return arr;
                });
            })
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Gets all tickets by id categorized by their respective labels
     * @param label
     * @returns {Generator<*, void, *>}
     */
    *getTicketsByLabel(label) {
        try {
            db.transaction(function (tx) {
                tx.executeSql('SELECT id FROM tickets WHERE label=?', [label], function (tx, results) {
                    let length = results.rows.length, i, arr = [results.rows.length];
                    for (i = 0; i < length; i++) {
                        arr[i] = results.rows.item(i).text;
                    }
                    return arr;
                });
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Updates the project title attribute of the ticket
     * @param newProjectTitle
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    *updateProjectTitle(newProjectTitle, id, date, user) {
        try {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE tickets SET projectTitle=? WHERE id=?', [newProjectTitle, id]);
            });
        } catch (e) {
            console.error(e);
            return;
        }

        this.createHistory(date, "Project Update - " + newProjectTitle, user);
    }

    /**
     * Updates the Responder of the ticket if someone responds to it or deletes their response
     * @param responder
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    *updateResponder(responder, id, date, user) {
        try {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE tickets SET responder=? WHERE id=?', [responder, id]);
            });
        } catch (e) {
            console.error(e);
            return;
        }

        this.createHistory(date, "Ticket Response", user);
    }

    /**
     * Updates the category of the ticket
     * @param newCategory
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    *updateCategory(newCategory, id, date, user) {
        try {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE tickets SET category=? WHERE id=?', [newCategory, id]);
            });
        } catch (e) {
            console.error(e);
            return;
        }

        this.createHistory(date, "Category Update - " + newCategory, user);
    }

    /**
     * Updates the label of the ticket
     * @param newLabel
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    *updateLabel(newLabel, id, date, user) {
        try {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE tickets SET label=? WHERE id=?', [newLabel, id]);
            });
        } catch (e) {
            console.error(e);
            return;
        }

        this.createHistory(date, "Label Change - " + newLabel, user);
    }

    /**
     * Updates the content of the ticket with a new string
     * @param newContent
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    *updateContent(newContent, id, date, user) {
        try {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE tickets SET content=? WHERE id=?', [newContent, id]);
            });
        } catch (e) {
            console.error(e);
            return;
        }

        this.createHistory(date, "Content Edit", user);
    }

    /**
     * Updates the title of the ticket
     * @param newTitle
     * @param id
     * @param date
     * @param user
     * @returns {Generator<*, void, *>}
     */
    *updateTitle(newTitle, id, date, user) {
        try {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE tickets SET title=? WHERE id=?', [newTitle, id]);
            });
        } catch (e) {
            console.error(e);
            return;
        }

        this.createHistory(date, "Title Change - " + newTitle, user);
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
    *createTicket(id, title, author, time, content, label, projectTitle, responder, category) {
        try {
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO tickets(id,title,author,time,content,label,projectTitle,responder,category) VALUES (?,?,?,?,?,?,?,?,?)',
                    [id, title, author, time, content, label, projectTitle, responder, category]);
            });
        } catch (e) {
            console.error(e);
            return;
        }

        this.createHistory(time, "Opened Ticket", author);
    }

    /**
     * Creates a new history row in the database for any creation or update event
     * @param date
     * @param description
     * @param user
     * @returns {Generator<*, void, *>}
     */
    *createHistory(date, description, user) {
        try {
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO history(date,description,user) VALUES (?,?,?)',
                    [date, description, user]);
            });
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = database;

