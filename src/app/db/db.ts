const sqlite3 = require('sqlite3').verbose();


// initializes and returns the database
export function initDB() {
    const db = new sqlite3.Database('public/shelvd.sqlite');
    return db;
}


export function getTables(db: any) {
    db.serialize(() => {
        db.each("SELECT name FROM sqlite_master WHERE type='table'", (err: any, row: any) => {
            if (err) {
                console.error(err);
            } else {
                console.log(row.name);
            }
        });
    });
}

export function closeDB(db: any) {
    db.close();
}