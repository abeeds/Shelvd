import { DB,  tableExists } from "./db";
import { TYPE, TYPEID, TYPENAME } from "./db";


const TYPE_COLS = `(${TYPENAME})`;


export async function insertType(type_name: string): Promise<[boolean, string]> {
    const exists = await tableExists(TYPE);
    if(!exists) return [false, "Type table does not exist."];

    return new Promise((resolve) => {
        DB.run(`INSERT INTO ${TYPE} ${TYPE_COLS}
            VALUES (?)`,
            [type_name],
            (err: any) => {
                if (err) resolve([false, `${err}`]);
                resolve([true, "Type created successfully."]);
            }
        );
    });
}


export async function updateType(type_id: number, new_name: string): Promise<[boolean, string]> {
    const exists = await tableExists(TYPE);
    if(!exists) return [false, "Type table does not exist."];

    return new Promise((resolve) => {
        DB.run(`
            UPDATE ${TYPE}
            SET ${TYPENAME} = ?
            WHERE ${TYPEID} = ?`,
            [new_name, type_id],
            (err: any) => {
                if (err) resolve([false, `${err}`]);
                resolve([true, `Type ${type_id} updated successfully.`]);
            }
        );
    });
}


export async function deleteType(type_id: string): Promise<[boolean, string]> {
    const exists = await tableExists(TYPE);
    if(!exists) return [false, "Type table does not exist."];

    return new Promise((resolve) => {
        DB.run(`
            DELETE FROM ${TYPE} WHERE ${TYPEID} = ?`,
            [type_id],
            (err: any) => {
                if (err) resolve([false, `${err}`]);
                resolve([true, `Type ${type_id} deleted successfully.`]);
            }
        );
    })
}