const sqlite3 = require('sqlite3').verbose();


// Table names and attributes
const ENTRY = "Entry";
const ENTRYID = "entryID";
const ENTRYNAME = "entryNAME";
const ENTRYIMAGE = "entryImage"; // url to image
const ENTRYTYPE = "entryType"; // direct to another table

const SHELF = "Shelf";
const SHELFID = "shelfID";
const SHELFNAME = "shelfName";
const SHELFDESC = "shelfDesc";

const SUBSHELF = "SubShelf";
const PARENTID = "parentID";
const CHILDID = "childID";

const SHELFITEM = "ShelfItem"; // shelfID and parentID


export function numTables(db: any): Promise<number> {
    return new Promise((resolve) => {
        let count = 0;

        db.each("SELECT name FROM sqlite_master WHERE type='table'", (err: any, row: any) => {
            count += 1;
        }, () => {
            resolve(count);
        });
    });
}

export function closeDB(db: any) {
    db.close();
}


// column should be comma separated values that you would 
// write in the parenthesis of a create table query
// ex: column = "id int, name varchar(255)";
export function createTable(db: any, name: string, column: string) {
    name = name.replace(/"/g, '""');    // handle quotations in the name
    let query: string = `CREATE TABLE "${name}" (${column})`;
    db.run(query);
}


// creates the tables required for this app to work
export function initTables(db: any) {
    createTable(db, SHELF,
        `${SHELFID} int,
        ${SHELFNAME} varchar(255),
        ${SHELFDESC} TEXT,
        PRIMARY KEY (${SHELFID})`
    );
    createTable(db, SUBSHELF, 
        `${PARENTID} int,
        ${CHILDID} int,
        PRIMARY KEY (${PARENTID}, ${CHILDID})`
    );
}


// initializes and returns the database
export function initDB() {
    const db = new sqlite3.Database("public/shelvd.sqlite");

    // initialize tables if there aren't any
    let ntables = numTables(db);
    ntables.then((res) => {
        if(res == 0) {
            initTables(db);
        }
    })

    return db;
}
