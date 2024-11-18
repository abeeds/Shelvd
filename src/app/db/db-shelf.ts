import { DB,  tableExists } from "./db";
import { SHELF, SHELFID, SHELFNAME, SHELFDESC } from "./db"; // shelf columns


const SHELF_COLS = `(${SHELFNAME}, ${SHELFDESC})`;


export async function insertShelf(shelf_name: string, shelf_desc: string=``): Promise<[boolean, string]> {
    const exists = await tableExists(SHELF);
    if(!exists) return [false, "Shelf table does not exist."];

    return new Promise((resolve) => {
        DB.run(`INSERT INTO ${SHELF} ${SHELF_COLS}
            VALUES ($shelfname, $shelfdesc)`, {
            $shelfname: shelf_name,
            $shelfdesc: shelf_desc
        }, (err: any) => {
            if(err) resolve([false, `${err}`]);
            resolve([true, "Shelf created successfully."])
        })
    })
}


export async function updateShelf(shelf_id: number, new_name: string=``, new_desc: string=``): Promise<[boolean, string]> {
    const exists = await tableExists(SHELF);
    if(!exists) return [false, "Shelf table does not exist."];

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
    return new Promise((resolve) => {
        DB.run(query, params, (err: any) => {
            if(err) resolve([false, `${err}`]);
            resolve([true, `Shelf ${shelf_id} updated successfully.`]);
        });
    });
}


export async function deleteShelf(shelf_id: number): Promise<[boolean, string]> {
    const exists = await tableExists(SHELF);
    if (!exists) return [false, "Shelf table does not exist."];

    return new Promise((resolve) => {
        DB.run(`DELETE FROM ${SHELF} WHERE ${SHELFID} = ?`, [shelf_id], (err:any) => {
            if(err) resolve([false, `${err}`]);
            resolve([true, `Shelf ${shelf_id} deleted.`]);
        });
    });
}
