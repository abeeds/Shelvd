import { DB, ITEMNAME, tableExists } from "./db";
import { ITEM, ITEMID, ITEMIMAGE, ITEMTYPE } from "./db"; // item collumns
import { SHELFITEM } from "./db";

const ITEM_COLS = `(${ITEMNAME}, ${ITEMIMAGE}, ${ITEMTYPE})`;


export async function insertItem(
    item_name: string,
    item_image: string=``,
    item_type: string=``
): Promise<[boolean, string]> {
    const exists = await tableExists(ITEM);
    if(!exists) return [false, "Item table does not exist"];

    return new Promise((resolve) => {
        DB.run(`INSERT INTO ${ITEM} ${ITEM_COLS}
            VALUES (?, ?, ?)`,
            [item_name, item_image, item_type],
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
    new_type: string=``
) {
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


// delete item


// check if item in shelf


// add to shelf


// remove from shelf


// move to different shelf