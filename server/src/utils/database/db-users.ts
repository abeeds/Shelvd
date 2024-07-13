import { findMany, insertOne } from "./db-connect";
import { userSchema } from "./schemas/user";


// fields
const USERS_COLLECT = 'users';
const EMAIL = 'email';
const USERNAME = 'username';
const PASSWORD = 'password';
const CREATION_DATE = 'creationDate';


export async function insertUser(email: string, username: string, password: string) {
    const newUser = {
        email: email,
        username: username,
        password: password,
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