const sqlite3 = require('sqlite3').verbose();
export let DB: any;

/**
* Contents (ctrl + f): 
*   GET TABLE DATA
*   DB MODIFYING FUNCTIONS
*   DB SETUP FUNCTIONS 
*/

// Table names and attributes
export const ITEM = "Item";
export const ITEMID = "item_id";
export const ITEMNAME = "item_name";
export const ITEMIMAGE = "item_img"; // url to image
export const ITEMTYPE = "item_type"; // direct to another table

export const SHELF = "Shelf";
export const SHELFID = "shelf_id";
export const SHELFNAME = "shelf_name";
export const SHELFDESC = "shelf_desc";

export const SUBSHELF = "Subshelf";
export const PARENTID = "parent_id";
export const CHILDID = "child_id";

export const SHELFITEM = "ShelfItem"; // shelfID and parentID

export const TYPE = "Type"; // table for different item types
export const TYPEID = "type_id";
export const TYPENAME = "type_name";

export const TABLECOUNT = "TableCount";
export const TCTABLENAME = "table_name";
export const TCROWCOUNT = "row_count";

export const SHELFCOUNT = 'ShelfCount';
// shelf id
export const SHELFROWS = 'shelf_rows';


// GET TABLE DATA


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


export function tableExists(name: string): Promise<Boolean> {
    return new Promise((resolve) => {
        DB.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${name}'`, (err: any, row: any) => {
            if (row) resolve(true);
            else resolve(false);
        });
    });
}


// END OF TABLE DATA FUNCTIONS
// DB MODIFYING FUNCTIONS


// column should be comma separated values that you would 
// write in the parenthesis of a create table query
// ex: column = "id INTEGER, name varchar(255)";
export function createTable(name: string, column: string): Promise<boolean> {
    name = name.replace(/"/g, '""');    // handle quotations in the name
    const query: string = `CREATE TABLE ${name} (${column})`;

    return new Promise((reject, resolve) => {
        DB.run(query, (err: any) => {
            if(err) resolve(false)
            else resolve(true)
        });
    });
}


// values should be a list of strings where each line contains a new row to be added
// the strings should be wrapped in a parenthesis
// ex: values = ['(a, b, c)', '(c, d, e)']
// custom columns will dictate the order and columns being used on the insert
// it should also be wrapped in parenthesis
// ex: '(col_a, col_b, col_c)'
export function insertInto(table_name: string, values: string[], custom_columns: string=""): Promise<boolean> {
    const query = `INSERT INTO ${table_name} ${custom_columns} VALUES ` + values.join(", ") + `;`;

    return new Promise((reject, resolve) => {
        DB.run(query, (err: any) => {
            if(err) resolve(false)
            else resolve(true)
        });
    });
}


// set should be a string containing comma separated values that are being modified
// ex: set = `a = 13, b = 'town hall'`
export function update(table_name: string, new_vals: string, condition: string): Promise<boolean> {
    const query = `UPDATE ${table_name} SET ${new_vals} WHERE ${condition}`;

    return new Promise((reject, resolve) => {
        DB.run(query, (err: any) => {
            if(err) resolve(false)
            else resolve(true)
        });
    });
}


export function deleteFrom(table_name: string, condition: string): Promise<boolean> {
    const query = `DELETE FROM ${table_name} WHERE ${condition}`;

    return new Promise((reject, resolve) => {
        DB.run(query, (err: any) => {
            if(err) resolve(false)
            else resolve(true)
        });
    });
}


// END OF DB MODIFYING FUNCTIONS
// DB SETUP FUNCTIONS 

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
