import * as argon2 from "argon2";
import logger from '../../utils/logger';
import { deleteOne, findMany, findOne, insertOne, updateOne } from "./db-connect";
import { shelfSchema } from "./schemas/shelf";
require('dotenv').config();


export const SHELF_COLLECT = 'shelves';


export async function insertShelf(
    owner: string,  // id of owner
    name: string,
    description: string='',
    parent: string='None', // id of parent shelf if any
) {
    const new_shelf = {
        owner: owner,
        name: name,
        description: description,
        parent: parent,
    }

    return insertOne(
        SHELF_COLLECT,
        shelfSchema,
        new_shelf
    )
}


export async function deleteShelf(
    owner: string,
    name: string
) {
    // TODO: set parent of sub shelves to the parent of the specified shelf
    const search = {
        owner: owner,
        name: name
    }

    return await deleteOne(
        SHELF_COLLECT,
        shelfSchema,
        search
    )
}