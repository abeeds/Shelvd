import * as argon2 from "argon2";
require('dotenv').config();
import { findMany, insertOne, updateOne } from "./db-connect";
import { userSchema } from "./schemas/user";


// fields
export const USERS_COLLECT = 'users';
const EMAIL = 'email';
const USERNAME = 'username';
const PASSWORD = 'password';
const CREATION_DATE = 'creationDate';


export async function insertUser(email: string, username: string, password: string) {
    const hash = await argon2.hash(
        password,
        {secret: Buffer.from(`${process.env.ARGON2_SECRET}`)}
    );

    const newUser = {
        email: email,
        username: username,
        password: hash,
        creationDate: new Date(),
    }

    // returns true or false
    return insertOne(USERS_COLLECT, userSchema, newUser);
}


/*
    need to add ways to narrow down the search
*/
export async function getUsers() {
    const fields = `${CREATION_DATE} ${EMAIL} ${USERNAME}`;

    return findMany(
        USERS_COLLECT, userSchema, {/*empty to skip this param*/}, fields
    );
}


/*
    updates username, identified by old_username, to new_username
    true: updated successfully
    false: couldn't find object
    null: something went wrong or db is not connected
*/
export async function updateUsername(
    old_username: string,
    new_username: string
) {
    const filt = {
        USERNAME: old_username
    };

    const update_obj = {
        USERNAME: new_username
    };

    return updateOne(USERS_COLLECT, userSchema, filt, update_obj);
}
