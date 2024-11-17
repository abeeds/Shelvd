import { DB, SHELFID, tableExists } from "./db";
import { ITEM, ITEMID, ITEMIMAGE, ITEMTYPE, ITEMNAME, ITEMRELEASE,} from "./db"; // item collumns
import { SHELFITEM } from "./db";

const ITEM_COLS = `(${ITEMNAME}, ${ITEMIMAGE}, ${ITEMTYPE}, ${ITEMRELEASE})`;
const SHELFITEM_COLS = `(${SHELFID}, ${ITEMID})`;


// release date should be in format yyyy-mm-dd
export async function insertItem(
    item_name: string,
    item_image: string=``,
    item_type: string=``,
    item_release: string=``,
): Promise<[boolean, string]> {
    const exists = await tableExists(ITEM);
    if(!exists) return [false, "Item table does not exist"];

    return new Promise((resolve) => {
        DB.run(`INSERT INTO ${ITEM} ${ITEM_COLS}
            VALUES (?, ?, ?, ?)`,
            [item_name, item_image, item_type, item_release],
            (err: any) => {
                if (err) resolve([false, `${err}`]);
                resolve([true, "Item created successfully."]);
            }
        );
    });
}


export async function updateItem(
    item_id: number,
    new_name: string=``,
    new_image: string=``,
    new_type: string=``,
    new_date
): Promise<[boolean, string]> {
    const exists = await tableExists(ITEM);
    if(!exists) return [false, "Item table does not exist"];

    // build query
    let params = [];
    let query = `UPDATE ${ITEM} SET `;
    if(new_name) {
        query += `${ITEMNAME} = ? `;
        params.push(new_name);
    } if(new_image) {
        if(params) query += `, `;
        query += `${ITEMIMAGE} = ? `;
        params.push(new_image);
    } if(new_type) {
        if(params) query += `, `;
        query += `${ITEMTYPE} = ? `;
        params.push(new_type);
    }
    query += `WHERE ${ITEMID} = ?`;
    params.push(item_id);

    // run query
    return new Promise((resolve) => {
        DB.run(query, params, (err: any) => {
            if (err) resolve([false, `${err}`]);
            resolve([true, `Item ${item_id} updated successfully.`]);
        });
    });
}


export async function deleteItem(item_id: number): Promise<[boolean, string]> {
    const exists = await tableExists(ITEM);
    if (!exists) return [false, "Item table does not exist."];

    return new Promise((resolve) => {
        DB.run(`DELETE FROM ${ITEM} WHERE ${ITEMID} = ?`, [item_id], (err:any) => {
            if(err) resolve([false, `${err}`]);
            resolve([true, `Item ${item_id} deleted.`]);
        });
    });
}


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
