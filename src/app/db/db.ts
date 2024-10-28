const sqlite3 = require('sqlite3').verbose();


export let DB: any;


// Table names and attributes
const ITEM = "Item";
const ITEMID = "item_id";
const ITEMNAME = "item_name";
const ITEMIMAGE = "item_img"; // url to image
const ITEMTYPE = "item_type"; // direct to another table

const SHELF = "Shelf";
const SHELFID = "shelf_id";
const SHELFNAME = "shelf_name";
const SHELFDESC = "shelf_desc";

const SUBSHELF = "Subshelf";
const PARENTID = "parent_id";
const CHILDID = "child_id";

const SHELFITEM = "ShelfItem"; // shelfID and parentID

const TYPE = "Type"; // table for different item types
const TYPEID = "type_id";
const TYPENAME = "type_name";

const TABLECOUNT = "TableCount";
const TCTABLENAME = "table_name";
const TCROWCOUNT = "row_count";

const SHELFCOUNT = 'ShelfCount';
// shelf id
const SHELFROWS = 'shelf_rows';


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
// ex: column = "id INTEGER, name varchar(255)";
export function createTable(name: string, column: string) {
    name = name.replace(/"/g, '""');    // handle quotations in the name
    let query: string = `CREATE TABLE ${name} (${column})`;
    DB.run(query);
}


export function tableExists(name: string): Promise<Boolean> {
    return new Promise((resolve) => {
        DB.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${name}'`, (err: any, row: any) => {
            if (row) resolve(true);
            else resolve(false);
        });
    });
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


// creates the tables and triggers required for this app to work
export function initTables() {
    DB.serialize(() => {
        createTable(TABLECOUNT,
            `${TCTABLENAME} varchar(255),
            ${TCROWCOUNT} INTEGER,
            PRIMARY KEY (${TCTABLENAME})`
        );
        createTable(SHELF,
            `${SHELFID} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${SHELFNAME} varchar(255),
            ${SHELFDESC} TEXT`
        );
        createTable(TYPE,
            `${TYPEID} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${TYPENAME} varchar(255)`
        )
        createTable(ITEM,
            `${ITEMID} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${ITEMNAME} TEXT,
            ${ITEMIMAGE} TEXT,
            ${ITEMTYPE} INTEGER,
            FOREIGN KEY (${ITEMTYPE}) REFERENCES ${TYPE}(${TYPEID})`
        );
        createTable(SUBSHELF,
            `${PARENTID} INTEGER,
            ${CHILDID} INTEGER,
            PRIMARY KEY (${PARENTID}, ${CHILDID}),
            FOREIGN KEY (${PARENTID}) REFERENCES ${SHELF}(${SHELFID}),
            FOREIGN KEY (${CHILDID}) REFERENCES ${SHELF}(${SHELFID})`
        );
        createTable(SHELFITEM,
            `${SHELFID} INTEGER,
            ${ITEMID} INTEGER,
            PRIMARY KEY (${SHELFID}, ${ITEMID}),
            FOREIGN KEY (${SHELFID}) REFERENCES ${SHELF}(${SHELFID}),
            FOREIGN KEY (${ITEMID}) REFERENCES ${ITEM}(${ITEMID})`
        );
        createTable(SHELFCOUNT, `
            ${SHELFID} INTEGER PRIMARY KEY,
            ${SHELFROWS} INTEGER,
            FOREIGN KEY (${SHELFID}) REFERENCES ${SHELF}(${SHELFID})`
        );

        // update row counts for each table after insert or delete
        const tables = [ITEM, SHELF, SUBSHELF, SHELFITEM, TYPE];
        for (const table of tables) {
            DB.run(`
                CREATE TRIGGER ${table}_rci
                AFTER INSERT ON ${table}
                BEGIN
                    UPDATE ${TABLECOUNT}
                    SET ${TCROWCOUNT} = ${TCROWCOUNT} + 1
                    WHERE ${TCTABLENAME} = '${table}';
                END;`
            );

            DB.run(`
                CREATE TRIGGER ${table}_rcd
                AFTER DELETE ON ${table}
                BEGIN
                    UPDATE ${TABLECOUNT}
                    SET ${TCROWCOUNT} = ${TCROWCOUNT} - 1
                    WHERE ${TCTABLENAME} = '${table}';
                END;`
            );
        };

        // manage data associated with a shelf
        DB.run(`
            CREATE TRIGGER insert_shelf
            AFTER INSERT ON ${SHELF}
            BEGIN
                INSERT INTO ${SHELFCOUNT}
                VALUES (NEW.${SHELFID}, 0);
            END;`
        );
        DB.run(`
            CREATE TRIGGER delete_shelf
            AFTER DELETE ON ${SHELF}
            BEGIN
                DELETE FROM ${SHELFCOUNT}
                WHERE ${SHELFID} = OLD.${SHELFID};

                DELETE FROM ${SHELFITEM}
                WHERE ${SHELFID} = OLD.${SHELFID};
            END;`
        );
    });
}


// initializes and returns the database
export function initDB() {
    DB = new sqlite3.Database("public/shelvd.sqlite");

    // initialize tables if there aren't any
    let ntables = numTables();
    ntables.then((table_count) => {
        if(table_count == 0) {
            initTables();
        }
    });
}
