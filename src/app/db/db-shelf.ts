import { DB, insertInto, tableExists } from "./db";
import { SHELF, SHELFID, SHELFNAME, SHELFDESC } from "./db"; // shelf columns
const sqlite3 = require('sqlite3').verbose();


const COLS = `(${SHELFNAME}, ${SHELFDESC})`;


// the bool returns if the shelf was created successfully
// the string is an associated messaage
export async function createShelf(shelf_name: string, shelf_desc: string=``): Promise<[boolean, string]> {
    const exists = await tableExists(SHELF);

    if(exists) {
        const success = await insertInto(SHELF, [`(${shelf_name}, ${shelf_desc})`], COLS);
        return success ? [true, "Shelf created successfully."] : [false, "Failed to create shelf."];
    } else {
        return [false, "Shelf table does not exist."];
    }
}


// update shelf


// delete shelf


// move shelf
// change subshelf relation


// add child shelf
// create subshelf relation
