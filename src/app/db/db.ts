const sqlite3 = require('sqlite3').verbose();


export let DB: any;


// Table names and attributes
const ITEM = "Item";
const ITEMID = "itemID";
const ITEMNAME = "itemNAME";
const ITEMIMAGE = "itemImage"; // url to image
const ITEMTYPE = "itemType"; // direct to another table

const SHELF = "Shelf";
const SHELFID = "shelfID";
const SHELFNAME = "shelfName";
const SHELFDESC = "shelfDesc";

const SUBSHELF = "SubShelf";
const PARENTID = "parentID";
const CHILDID = "childID";

const SHELFITEM = "ShelfItem"; // shelfID and parentID

const TYPE = "Type"; // table for different item types
const TYPEID = "typeID";
const TYPENAME = "typeName";


export function numTables(): Promise<number> {
    return new Promise((resolve) => {
        let count = 0;

        DB.each("SELECT name FROM sqlite_master WHERE type='table'", (err: any, row: any) => {
            count += 1;
        }, () => {
            resolve(count);
        });
    });
}


// column should be comma separated values that you would 
// write in the parenthesis of a create table query
// ex: column = "id int, name varchar(255)";
export function createTable(name: string, column: string) {
    name = name.replace(/"/g, '""');    // handle quotations in the name
    let query: string = `CREATE TABLE ${name} (${column})`;
    DB.run(query);
}


export function getColumns(table_name: string): Promise<any[]> {
    const query = `PRAGMA table_info(${table_name})`;
    let res: any[] = [];

    return new Promise((resolve) => {
        DB.all(query, (err: any, rows: any[]) => {
            rows.forEach(row => {
                res.push(row.name);
            });

            resolve(res);
        });
    });
}


// creates the tables required for this app to work
export function initTables() {
    createTable(SHELF,
        `${SHELFID} int,
        ${SHELFNAME} varchar(255),
        ${SHELFDESC} TEXT,
        PRIMARY KEY (${SHELFID})`
    );
    createTable(TYPE,
        `${TYPEID} int,
        ${TYPENAME} varchar(255),
        PRIMARY KEY (${TYPEID})`
    )
    createTable(ITEM,
        `${ITEMID} int,
        ${ITEMNAME} TEXT,
        ${ITEMIMAGE} TEXT,
        ${ITEMTYPE} int,
        PRIMARY KEY (${ITEMID}),
        FOREIGN KEY (${ITEMTYPE}) REFERENCES ${TYPE}(${TYPEID})`
    );
    createTable(SUBSHELF,
        `${PARENTID} int,
        ${CHILDID} int,
        PRIMARY KEY (${PARENTID}, ${CHILDID}),
        FOREIGN KEY (${PARENTID}) REFERENCES ${SHELF}(${SHELFID}),
        FOREIGN KEY (${CHILDID}) REFERENCES ${SHELF}(${SHELFID})`
    );
    createTable(SHELFITEM,
        `${SHELFID} int,
        ${ITEMID} int,
        PRIMARY KEY (${SHELFID}, ${ITEMID}),
        FOREIGN KEY (${SHELFID}) REFERENCES ${SHELF}(${SHELFID}),
        FOREIGN KEY (${ITEMID}) REFERENCES ${ITEM}(${ITEMID})`
    );
}


// initializes and returns the database
export function initDB() {
    DB = new sqlite3.Database("public/shelvd.sqlite");

    // initialize tables if there aren't any
    let ntables = numTables();
    ntables.then((res) => {
        if(res == 0) {
            initTables();
        }
    });
}
