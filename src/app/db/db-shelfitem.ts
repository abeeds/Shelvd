import { DB,  tableExists } from "./db";
import { SHELFITEM, SHELFID, ITEMID } from "./db";

const SHELFITEM_COLS = `(${SHELFID}, ${ITEMID})`;


export async function checkShelfItem(shelf_id: number, item_id: number): Promise<[boolean, string]> {
    const exists = await tableExists(SHELFITEM);
    if(!exists) return [false, "ShelfItem table does not exist."];

    return new Promise((resolve) => {
            DB.run(`SELECT * FROM ${SHELFITEM} WHERE ${SHELFID} = ? AND ${ITEMID} = ?`,
            [shelf_id, item_id],
            (err: any, row: any) => {
                if (err) resolve([false, `${err}`]);
                else if (row) resolve([true, `${item_id} is not in the shelf ${shelf_id}.`]);
                else resolve([false, `${item_id} is not in the shelf ${shelf_id}.`]);
            }
        );
    });
}


export async function insertShelfItem(shelf_id: number, item_id: number): Promise<[boolean, string]> {
    const table_exists = await tableExists(SHELFITEM);
    if(!table_exists) return [false, "ShelfItem table does not exist."];

    return new Promise((resolve) => {
        DB.run(`INSERT INTO ${SHELFITEM} ${SHELFITEM_COLS}
            VALUES (?, ?)`,
            [shelf_id, item_id],
            (err: any) => {
                if (err) resolve([false, `${err}`]);
                resolve([true, `${item_id} is now in the shelf ${shelf_id}`]);
            }
        );
    });
}


export async function deleteShelfItem(shelf_id: number, item_id: number): Promise<[boolean, string]> {
    const table_exists = await tableExists(SHELFITEM);
    if(!table_exists) return [false, "ShelfItem table does not exist."];

    return new Promise((resolve) => {
            DB.run(`DELETE FROM ${SHELFITEM} WHERE ${SHELFID} = ? AND ${ITEMID} = ?`,
            [shelf_id, item_id],
            (err: any) => {
                if(err) resolve([false, `${err}`]);
                resolve([true, "Deleted ShelfItem relation."])
            }
        );
    });
}


// moves an item to a new shelf
// if it already exists in the new shelf
// it will just delete it from the old shelf
export async function moveShelfItem(new_shelf_id: number, old_shelf_id: number, item_id: number): Promise<[boolean, string]> {
    const table_exists = await tableExists(SHELFITEM);
    if(!table_exists) return [false, "ShelfItem table does not exist."];
    const in_new_shelf = await checkShelfItem(new_shelf_id, item_id);

    let success: [boolean, string] = [true, `Moved ${item_id} to ${new_shelf_id}`];
    if(!in_new_shelf) {new_shelf_id
        success = await insertShelfItem(new_shelf_id, item_id);
    }

    if(success[0]) {
        success = await deleteShelfItem(old_shelf_id, item_id);
    }

    return success;
}
