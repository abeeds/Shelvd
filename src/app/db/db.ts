const sqlite3 = require('sqlite3').verbose();
export let DB: any;

/**
* Contents (ctrl + f): 
*   GET TABLE DATA
*   DB SETUP FUNCTIONS 
*/

// Table names and attributes
export const ITEM = "Item";
export const ITEMID = "item_id";
export const ITEMNAME = "item_name";
export const ITEMIMAGE = "item_img"; // url to image
export const ITEMTYPE = "item_type"; // direct to another table
export const ITEMRELEASE = "item_release_date";

export const SHELF = "Shelf";
export const SHELFID = "shelf_id";
export const SHELFNAME = "shelf_name";
export const SHELFDESC = "shelf_desc";

export const SUBSHELF = "Subshelf";
export const PARENTID = "parent_id";
export const CHILDID = "child_id";

export const SHELFITEM = "ShelfItem"; // shelf_id and item_id

export const TYPE = "Type"; // table for different item types
export const TYPEID = "type_id";
export const TYPENAME = "type_name";

export const TABLECOUNT = "TableCount";
export const TCTABLENAME = "table_name";
export const TCROWCOUNT = "row_count";

export const SHELFCOUNT = 'ShelfCount';
// shelf id
export const SHELFROWS = 'shelf_rows';

export const TAG = 'Tag';
export const TAGID = 'tag_id';
export const TAGNAME = 'tag_name';

export const ITEMTAG = 'ItemTag';
// tag_id, item_id


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
// DB SETUP FUNCTIONS 

// creates the tables and triggers required for this app to work
export function initTables() {
    DB.serialize(() => {
        DB.run(`CREATE TABLE ${TABLECOUNT} (
                ${TCTABLENAME} varchar(255),
                ${TCROWCOUNT} INTEGER,
                PRIMARY KEY (${TCTABLENAME})
            )`
        )
        DB.run(`CREATE TABLE ${SHELF} (
                ${SHELFID} INTEGER PRIMARY KEY AUTOINCREMENT,
                ${SHELFNAME} varchar(255),
                ${SHELFDESC} TEXT
            )`
        )
        DB.run(`CREATE TABLE ${TYPE} (
                ${TYPEID} INTEGER PRIMARY KEY AUTOINCREMENT,
                ${TYPENAME} varchar(255)
            )`
        )
        DB.run(`CREATE TABLE ${ITEM} (
                ${ITEMID} INTEGER PRIMARY KEY AUTOINCREMENT,
                ${ITEMNAME} TEXT,
                ${ITEMIMAGE} TEXT,
                ${ITEMTYPE} INTEGER,
                ${ITEMRELEASE} TEXT,
                FOREIGN KEY (${ITEMTYPE}) REFERENCES ${TYPE}(${TYPEID})
            )`
        );
        DB.run(`CREATE TABLE ${SUBSHELF} (
                ${PARENTID} INTEGER,
                ${CHILDID} INTEGER,
                PRIMARY KEY (${PARENTID}, ${CHILDID}),
                FOREIGN KEY (${PARENTID}) REFERENCES ${SHELF}(${SHELFID}),
                FOREIGN KEY (${CHILDID}) REFERENCES ${SHELF}(${SHELFID})
            )`
        );
        DB.run(`CREATE TABLE ${SHELFITEM} (
                ${SHELFID} INTEGER,
                ${ITEMID} INTEGER,
                PRIMARY KEY (${SHELFID}, ${ITEMID}),
                FOREIGN KEY (${SHELFID}) REFERENCES ${SHELF}(${SHELFID}),
                FOREIGN KEY (${ITEMID}) REFERENCES ${ITEM}(${ITEMID})
            )`
        );
        DB.run(`CREATE TABLE ${SHELFCOUNT} (
                ${SHELFID} INTEGER PRIMARY KEY,
                ${SHELFROWS} INTEGER,
                FOREIGN KEY (${SHELFID}) REFERENCES ${SHELF}(${SHELFID})
            )`
        );
        DB.run(`CREATE TABLE ${TAG} (
                ${TAGID} TEXT PRIMARY KEY AUTOINCREMENT,
                ${TAGNAME} TEXT UNIQUE
            )`
        );
        DB.run(`CREATE TABLE ${ITEMTAG} (
                ${ITEMID} INTEGER,
                ${TAGID} INTEGER,
                PRIMARY KEY (${ITEMID}, ${TAGID}),
                FOREIGN KEY (${ITEMID}) REFERENCES ${ITEM}(${ITEMID}),
                FOREIGN KEY (${TAGID}) REFERENCES ${TAG}(${TAGID})
            )`
        );

        // update row counts for each table after insert or delete
        const tables = [ITEM, SHELF, SUBSHELF, SHELFITEM, TYPE, TAG, ITEMTAG];
        for (const table of tables) {
            DB.run(`INSERT INTO ${TABLECOUNT} (${TCTABLENAME}, ${TCROWCOUNT})
                VALUES (?, ?)`,
                [table, 0]
            );
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
        DB.run(`
            CREATE TRIGGER inc_shelf_count
            AFTER INSERT ON ${SHELFITEM}
            BEGIN
                UPDATE ${SHELFCOUNT}
                SET ${SHELFROWS} = ${SHELFROWS} + 1
                WHERE ${SHELFID} = NEW.${SHELFID};
            END;`
        );
        DB.run(`
            CREATE TRIGGER dec_shelf_count
            AFTER DELETE ON ${SHELFITEM}
            BEGIN
                UPDATE ${SHELFCOUNT}
                SET ${SHELFROWS} = ${SHELFROWS} - 1
                WHERE ${SHELFID} = OLD.${SHELFID};
            END;`
        );
        DB.run(`
            CREATE TRIGGER delete_tag
            AFTER DELETE ON ${TAG}
            BEGIN
                DELETE FROM ${ITEMTAG}
                WHERE ${TAGNAME} = OLD.${TAGNAME};
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
