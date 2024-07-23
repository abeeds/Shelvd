import logger from '../../utils/logger';
import { findMany, findOne, insertOne, updateOne } from "./db-connect";
import { entrySchema } from './schemas/entry';
require('dotenv').config();


export const ENTRY_COLLECT = 'entries';



export function createEntry(
    api: string,
    api_id: string,
    img_id: string,
    name: string,
) {
    const new_entry = {
        api: api,
        api_id: api_id,
        img_id: img_id,
        name: name,
    }

    return insertOne(ENTRY_COLLECT, entrySchema, new_entry);
}
