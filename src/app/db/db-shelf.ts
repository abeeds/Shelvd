import { Query } from "@angular/core";
import { DB,  tableExists } from "./db";
import { SHELF, SHELFID, SHELFNAME, SHELFDESC } from "./db"; // shelf columns
const sqlite3 = require('sqlite3').verbose();


const COLS = `(${SHELFNAME}, ${SHELFDESC})`;


export async function createShelf(shelf_name: string, shelf_desc: string=``): Promise<[boolean, string]> {
    const exists = await tableExists(SHELF);

    if(exists) {
        let result = true;
        await DB.run(`INSERT INTO ${SHELF} ${COLS}
            VALUES ($shelfname, $shelfdesc)`, {
            $shelfname: shelf_name,
            $shelfdesc: shelf_desc
        }, (err: any) => {
            if(err) result = false
        })

        return result ? [result, "Shelf created successfully."] : [result, "Failed to create shelf."];
    } else {
        return [false, "Shelf table does not exist."];
    }
}



export async function updateShelf(shelf_id: number, new_name: string=``, new_desc: string=``) {
    const exists = await tableExists(SHELF);
}

// delete shelf


// move shelf
// change subshelf relation


// add child shelf
// create subshelf relation
