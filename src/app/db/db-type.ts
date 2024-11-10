import { DB,  tableExists } from "./db";
import { TYPE, TYPEID, TYPENAME } from "./db";


const TYPE_COLS = `(${TYPENAME})`;


export async function insertType(type_name: string): Promise<[boolean, string]> {
    const exists = await tableExists(TYPE);
    if(!exists) return [false, "Type table does not exist."];
}


export async function updateType(old_name: string, new_name: string): Promise<[boolean, string]> {
    const exists = await tableExists(TYPE);
    if(!exists) return [false, "Type table does not exist."];
}


export async function deleteType(type_name: string): Promise<[boolean, string]> {
    const exists = await tableExists(TYPE);
    if(!exists) return [false, "Type table does not exist."];
}