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


// update item


// delete item


// check if item in shelf


// add to shelf


// remove from shelf


// move to different shelf