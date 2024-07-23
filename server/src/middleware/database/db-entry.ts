import logger from '../../utils/logger';
import { deleteOne, findMany, findOne, insertOne, updateOne } from "./db-connect";
import { entrySchema } from './schemas/entry';
require('dotenv').config();


export const ENTRY_COLLECT = 'entries';



export function createEntry(
    api: string,
    api_id: string,
    img_id: string,
    name: string,
) {
    const my_entry = findEntry(api, api_id);
    if(Object.keys(my_entry).length !== 0) {
        return my_entry;
    }

    const new_entry = {
        api: api,
        api_id: api_id,
        img_id: img_id,
        name: name,
    }

    return insertOne(ENTRY_COLLECT, entrySchema, new_entry);
}


export async function deleteEntry(
    api: string,
    api_id: string,
) {
    const search = {
        api: api,
        api_id: api_id,
    }

    return await deleteOne(
        ENTRY_COLLECT,
        entrySchema,
        search
    )
}


export async function findEntry(
    api: string,
    api_id: string,
) {
    const search = {
        api: api,
        api_id: api_id,
    }

    return await findOne(
        ENTRY_COLLECT,
        entrySchema,
        search,
    )
}
