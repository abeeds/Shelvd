import { DB, tableExists } from "./db";
import { TAG, TAGID, TAGNAME } from "./db"; // tag columns


const TAG_COLS = `(${TAGNAME})`;


export async function insertTag(tag_name: string): Promise<[boolean, string]> {
    const exists = await tableExists(TAG);
    if(!exists) return [false, "Tag table does not exist."];

    return new Promise((resolve) => {
        DB.run(`INSERT INTO ${TAG} ${TAG_COLS}
            VALUES (?)`,
            [TAGNAME],
            (err: any) => {
                if (err) resolve([false, `${err}`]);
                resolve([true, "Tag created successfully."]);
            }
        );
    });
}


export async function updateTag(id: number, new_name: string) {
    const exists = await tableExists(TAG);
    if(!exists) return [false, "Item table does not exist"];

    return new Promise((resolve) => {
        DB.run(
            `UPDATE ${TAG} SET ${TAGNAME} = ? WHERE ${TAGID} = ?`,
            [new_name, id],
            (err: any) => {
                if (err) resolve([false, `${err}`]);
                resolve([true, `Tag ${id} renamed to ${new_name} successfully.`]);
        });
    });
}


// delete tag