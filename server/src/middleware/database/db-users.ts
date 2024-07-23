import * as argon2 from "argon2";
import logger from '../../utils/logger';
require('dotenv').config();
import { findMany, findOne, insertOne, updateOne } from "./db-connect";
import { userSchema } from "./schemas/user";


// fields
export const USERS_COLLECT = 'users';
const EMAIL = 'email';
const USERNAME = 'username';
const PASSWORD = 'password';
const CREATION_DATE = 'creationDate';
const DISPLAY_FIELDS = `${CREATION_DATE} ${EMAIL} ${USERNAME}`; // used for select on find calls


export async function insertUser(email: string, username: string, password: string) {
    const hash = await argon2.hash(
        password,
        {secret: Buffer.from(`${process.env.ARGON2_SECRET}`)}
    );

    const new_user = {
        email: email,
        username: username,
        password: hash,
        creationDate: new Date(),
    }

    // returns true or false
    return insertOne(USERS_COLLECT, userSchema, new_user);
}


/*
    need to add ways to narrow down the search
*/
export async function getUsers() {
    return findMany(
        USERS_COLLECT,
        userSchema,
        {/*empty to skip this param*/},
        DISPLAY_FIELDS
    );
}


// takes email, username, or both to check account info
// if both are passed, the username is expected to match the email
export async function findUser(
    email: string ='',
    username: string = ''
) {
    let search: any = {};

    // no fields provided
    if(email === '' && username === '') {
        return null;
    }
    if(email !== '') {
        search.email = email;
    }
    if(username !== '') {
        search.username = username;
    }

    return findOne(
        USERS_COLLECT,
        userSchema,
        search
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


// matches password using the given username to identify the account
// 
export async function verifyPassword(
    email: string,
    username: string,
    password: string
) {
    const user = await findUser(email, username);
    if(user !== null && Object.keys(user).length !== 0) {
        return await argon2.verify(
            user.password.toString(),
            password,
            {secret: Buffer.from(`${process.env.ARGON2_SECRET}`)}
        );
    } else {
        return false;
    }
}