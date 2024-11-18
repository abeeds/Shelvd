import { DB,  tableExists } from "./db";
import { ITEMTAG, TAGID, ITEMID } from "./db";


const ITEMTAG_COLS = `(${ITEMID}, ${TAGID})`;


export async function addTagToItem(item_id: number, tag_id: number): Promise<[boolean, string]> {
    const exists = await tableExists(ITEMTAG);
    if(!exists) return [false, "ItemTag table does not exist."];

    return new Promise((resolve) => {
        DB.run(`INSERT INTO ${ITEMTAG} ${ITEMTAG_COLS}
            VALUES (?)`,
            [item_id, tag_id],
            (err: any) => {
                if (err) resolve([false, `${err}`]);
                resolve([true, "Tag added successfully."]);
            }
        );
    });
}


export async function delTagFromItem(item_id: number, tag_id: number) {
    const exists = await tableExists(ITEMTAG);
    if(!exists) return [false, "ItemTag table does not exist."];

    return new Promise((resolve) => {
        DB.run(`DELETE FROM ${ITEMTAG} WHERE ${TAGID} = ? AND ${ITEMID} = ?` ,
            [tag_id, item_id], (err:any) => {
                if(err) resolve([false, `${err}`]);
                resolve([true, `Tag removed.`]);
            }
        );
    });
}
