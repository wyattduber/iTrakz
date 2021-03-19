function dbInit() {
    const db = openDatabase('itrakz', '1.0', 'Tickets', 2 * 1024 * 1024);
    db.transaction (function(tx) {
       tx.executeSql(
           'CREATE TABLE IF NOT EXISTS tickets(' +
           'id INT NOT NULL, ' +
           'title VARCHAR(200) NOT NULL, ' +
           'author VARCHAR(50) NOT NULL, ' +
           'time DATETIME NOT NULL, ' +
           'content LONGTEXT NOT NULL, ' +
           'label VARCHAR(20) NOT NULL, ' +
           'projectTitle VARCHAR(50) NOT NULL, ' +
           'responder VARCHAR(50), ' +
           'category VARCHAR(20), ' +
           'label VARCHAR(20) NOT NULL' +
           ');'
        );

        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS history(' +
            'date DATETIME NOT NULL' +
            'description VARCHAR(200) NOT NULL' +
            'user VARCHAR(50) NOT NULL' +
            ');'
        );

    });
}