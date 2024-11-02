import { Query } from "@angular/core";
import { DB,  tableExists } from "./db";
import { SHELF, SHELFID, SHELFNAME, SHELFDESC } from "./db"; // shelf columns
import { SUBSHELF, PARENTID, CHILDID } from "./db"; // subshelf columns
const sqlite3 = require('sqlite3').verbose();


const COLS = `(${SHELFNAME}, ${SHELFDESC})`;


export async function createShelf(shelf_name: string, shelf_desc: string=``): Promise<[boolean, string]> {
    const exists = await tableExists(SHELF);

    if(exists) {
        let success = true;
        await DB.run(`INSERT INTO ${SHELF} ${COLS}
            VALUES ($shelfname, $shelfdesc)`, {
            $shelfname: shelf_name,
            $shelfdesc: shelf_desc
        }, (err: any) => {
            if(err) success = false
        })

        return success ? [success, "Shelf created successfully."] : [success, "Failed to create shelf."];
    } else {
        return [false, "Shelf table does not exist."];
    }
}


export async function updateShelf(shelf_id: number, new_name: string=``, new_desc: string=``): Promise<[boolean, string]> {
    const exists = await tableExists(SHELF);

    if(exists) {
        // build query
        let params = [];
        let query = `UPDATE ${SHELF} SET `;
        if(new_name) {
            query += `${SHELFNAME} = ? `;
            params.push(new_name);
        } if (new_desc) {
            if(new_name) query += ', ';
            query += `${SHELFDESC} = ? `;
            params.push(new_desc);
        }
        query += `WHERE ${SHELFID} = ?`;
        params.push(shelf_id);

        // run query
        let success = true;
        await DB.run(query, params, (err: any) => {
            if(err) success = false;
        })
        return success ? [success, `Shelf ${shelf_id} updated successfully.`] : [success, "Failed to update shelf."];
    } else {
        return [false, "Shelf table does not exist."];
    }
}


export async function deleteShelf(shelf_id: number) {
    const exists = await tableExists(SHELF);

    if(exists) {
        let success = true;
        DB.run(`DELETE FROM ${SHELF} WHERE ${SHELFID} = ?`, [shelf_id], (err:any) => {
            if(err) success = false;
        })
        return success ? [success, `Shelf ${shelf_id} deleted.`] : [success, "Failed to delete shelf."];
    } else {
        return [false, "Shelf table does not exist."];
    }
}



export async function checkSubshelf(parent_id: number, child_id: number) {
    const exists = await tableExists(SHELF);
    if(!exists) return [false, "Shelf table does not exist."];

    let res = [false, `${child_id} is not a child of ${parent_id}.`]
    await DB.run(`SELECT * FROM ${SUBSHELF} WHERE ${PARENTID} = ? AND ${CHILDID} = ?`,
        [parent_id, child_id], (err: any, row: any) => {
            if (err) res = [false, "Failed to check subshelf."];
            else if (row) res = [true, `${child_id} is a child of ${parent_id}.`]
        }
    );
    return res;    
}


// add child shelf
// create subshelf relation
