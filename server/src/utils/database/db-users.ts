import { insertOne } from "./db-connect";
import { userSchema } from "./schemas/user";


const USERS_COLLECT = 'users';


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


export async function getUsers() {
    
}