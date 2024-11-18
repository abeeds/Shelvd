import { DB,  tableExists } from "./db";
import { SUBSHELF, PARENTID, CHILDID } from "./db"; // subshelf columns


const SUBSHELF_COLS = `(${PARENTID}, ${CHILDID})`;


export async function checkSubshelf(parent_id: number, child_id: number): Promise<[boolean, string]> {
    const exists = await tableExists(SUBSHELF);
    if(!exists) return [false, "Subshelf table does not exist."];

    return new Promise((resolve) => {
        DB.run(`SELECT * FROM ${SUBSHELF} WHERE ${PARENTID} = ? AND ${CHILDID} = ?`,
            [parent_id, child_id],
            (err: any, row: any) => {
                if (err) resolve([false, `${err}`]);
                else if (row) resolve([true, `${child_id} is a child of ${parent_id}.`]);
                else resolve([false, `${child_id} is not a child of ${parent_id}.`]);
            }
        );
    });
}


export async function insertSubshelf(parent_id: number, child_id: number): Promise<[boolean, string]> {
    const table_exists = await tableExists(SUBSHELF);
    if(!table_exists) return [false, "Subshelf table does not exist."];

    return new Promise((resolve) => {
        DB.run(`INSERT INTO ${SUBSHELF} ${SUBSHELF_COLS}
            VALUES (?, ?)`,
            [parent_id, child_id],
            (err: any) => {
                if (err) resolve([false, `${err}`]);
                resolve([true, `${child_id} is now a child of ${parent_id}`]);
            }
        );
    });
}


export async function deleteSubshelf(parent_id: number, child_id: number): Promise<[boolean, string]> {
    const exists = await tableExists(SUBSHELF);
    if(!exists) return [false, "Subshelf table does not exist."];

    return new Promise((resolve) => {
        DB.run(`DELETE FROM ${SUBSHELF} WHERE ${PARENTID} = ? AND ${CHILDID} = ?`,
            [parent_id, child_id],
            (err: any) => {
                if(err) resolve([false, `${err}`]);
                resolve([true, "Deleted subshelf relation."]);
            }
        );
    });
}


// moves a child shelf to a new parent shelf
// if it already exists in the new parent shelf
// it will just delete it from the old parent
export async function moveSubshelf(new_parent_id: number, old_parent_id: number, child_id: number): Promise<[boolean, string]> {
    const table_exists = await tableExists(SUBSHELF);
    if(!table_exists) return [false, "Subshelf table does not exist."];
    const in_new_shelf = await checkSubshelf(new_parent_id, child_id);

    let success: [boolean, string] = [true, `Moved ${child_id} to ${new_parent_id}`];
    if(!in_new_shelf) {
        success = await insertSubshelf(new_parent_id, child_id);
    }

    if(success[0]) {
        success = await deleteSubshelf(old_parent_id, child_id);
    }

    return success;
}
