let db; // Initialize Database Variable

function dbInit() {
    try {
        db = openDatabase('itrakz', '1.0', 'Tickets', 2 * 1024 * 1024);
        db.transaction(function (tx) {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS tickets(' +
                'id INT NOT NULL, ' +
                'title VARCHAR(200) NOT NULL, ' +
                'author VARCHAR(50) NOT NULL, ' +
                'time DATETIME NOT NULL, ' +
                'content LONGTEXT NOT NULL, ' +
                'label VARCHAR(20) NOT NULL, ' +
                'projectTitle VARCHAR(50), ' +
                'responder VARCHAR(50), ' +
                'category VARCHAR(20)' +
                ');'
            );

            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS history(' +
                'id INT NOT NULL, ' +
                'date DATETIME NOT NULL, ' +
                'description VARCHAR(200) NOT NULL, ' +
                'user VARCHAR(50) NOT NULL' +
                ');'
            );

        });
    } catch (e) {
        console.error(e);
    }
}

function getHistoryBit(id, bit) {
    try {
        db.transaction(function(tx) {
           switch (bit) {
               case "date":
                   tx.executeSql('SELECT date FROM history WHERE id=?', [id], function (tx, resultSet) {
                       return resultSet.rows.item(0);
                   });
                   break;
               case "description":
                   tx.executeSql('SELECT description FROM history WHERE id=?', [id], function (tx, resultSet) {
                       return resultSet.rows.item(0);
                   });
                   break;
               case "user":
                   tx.executeSql('SELECT user FROM history WHERE id=?', [id], function (tx, resultSet) {
                       return resultSet.rows.item(0);
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

function getTicketBit(id, bit) {
    try{
        db.transaction(function(tx) {
            switch (bit) {
                case "title":
                    tx.executeSql('SELECT title FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                        return resultSet.rows.item(0);
                    });
                    break;
                case "author":
                    tx.executeSql('SELECT author FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                        return resultSet.rows.item(0);
                    });
                    break;
                case "time":
                    tx.executeSql('SELECT time FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                        return resultSet.rows.item(0);
                    });
                    break;
                case "content":
                    tx.executeSql('SELECT content FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                        return resultSet.rows.item(0);
                    });
                    break;
                case "label":
                    tx.executeSql('SELECT label FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                        return resultSet.rows.item(0);
                    });
                    break;
                case "projectName":
                    tx.executeSql('SELECT projectName FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                        return resultSet.rows.item(0);
                    });
                    break;
                case "responder":
                    tx.executeSql('SELECT responder FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                        return resultSet.rows.item(0);
                    });
                    break;
                case "category":
                    tx.executeSql('SELECT name FROM tickets WHERE id=?', [id], function (tx, resultSet) {
                        return resultSet.rows.item(0);
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

function getTicketById(id) {
    let i, arr;
    try {
        db.transaction(function(tx) {
           tx.executeSql('SELECT * FROM tickets WHERE id=?', [id], function(tx, results) {
               arr = [results.rows.length];
               for (i = 0; i < results.rows.length; i++) {
                   arr[i] = results.rows.item(i);
               }
               return arr;
           });
        });

    } catch (e) {
        console.error(e);
    }
}

function getTicketsByAuthor(author) {
    try {
        db.transaction(function(tx) {
            tx.executeSql('SELECT id FROM tickets WHERE author=?', [author], function(tx, results) {
                let i, arr = [results.rows.length];
                for (i = 0; i < results.rows.length; i++) {
                    arr[i] = results.rows.item(i);
                }
                return arr;
            });
        })
    } catch (e) {
        console.error(e);
    }
}

function getTicketsByLabel(label) {
    try {
        db.transaction(function(tx) {
           tx.executeSql('SELECT id FROM tickets WHERE label=?', [label], function(tx, results) {
               let length = results.rows.length, i, arr = [results.rows.length];
               for (i = 0; i < length; i++) {
                   arr[i] = results.rows.item(i);
               }
               return arr;
           });
        });
    } catch (e) {
        console.error(e);
    }
}

function updateProjectTitle(newProjectTitle, id, date, user) {
    try {
        db.transaction(function (tx) {
            tx.executeSql('UPDATE tickets SET projectTitle=? WHERE id=?', [newProjectTitle, id]);
        });
    } catch (e) {
        console.error(e);
        return;
    }

    createHistory(date, "Project Update - " + newProjectTitle, user);
}

function updateResponder(responder, id, date, user) {
    try {
        db.transaction(function(tx) {
            tx.executeSql('UPDATE tickets SET responder=? WHERE id=?', [responder, id]);
        });
    } catch (e) {
        console.error(e);
        return;
    }

    createHistory(date, "Ticket Response", user);
}

function updateCategory(newCategory, id, date, user) {
    try {
        db.transaction(function (tx) {
            tx.executeSql('UPDATE tickets SET category=? WHERE id=?', [newCategory, id]);
        });
    } catch (e) {
        console.error(e);
        return;
    }

    createHistory(date, "Category Update - " + newCategory, user);
}

function updateLabel(newLabel, id, date, user) {
    try {
        db.transaction(function(tx) {
            tx.executeSql('UPDATE tickets SET label=? WHERE id=?', [newLabel, id]);
        });
    } catch (e) {
        console.error(e);
        return;
    }

    createHistory(date, "Label Change - " + newLabel, user);
}

function updateContent(newContent, id, date, user) {
    try {
        db.transaction(function(tx) {
            tx.executeSql('UPDATE tickets SET content=? WHERE id=?', [newContent, id]);
        });
    } catch (e) {
        console.error(e);
        return;
    }

    createHistory(date, "Content Edit", user);
}

function updateTitle(newTitle, id, date, user) {
    try {
        db.transaction(function(tx) {
            tx.executeSql('UPDATE tickets SET title=? WHERE id=?', [newTitle, id]);
        });
    } catch (e) {
        console.error(e);
        return;
    }

    createHistory(date, "Title Change - " + newTitle, user);
}

function createTicket(id, title, author, time, content, label, projectTitle, responder, category) {
    try {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO tickets(id,title,author,time,content,label,projectTitle,responder,category) VALUES (?,?,?,?,?,?,?,?,?)',
                [id, title, author, time, content, label, projectTitle, responder, category]);
        });
    } catch (e) {
        console.error(e);
        return;
    }

    createHistory(time, "Opened Ticket", author);
}

function createHistory(date, description, user) {
    try {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO history(date,description,user) VALUES (?,?,?)',
                [date, description, user]);
        });
    } catch (e) {
        console.error(e);
    }
}

