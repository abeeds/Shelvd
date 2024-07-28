import assert from "node:assert";
import test from "node:test";
import mongoose from "mongoose";
import * as argon2 from "argon2";
import { after, before, describe } from "node:test";
import { dbConnect } from "../../middleware/database/db-connect";
import { userSchema } from "../../middleware/database/schemas/user";
import { insertUser, updateUsername, verifyPassword } from "../../middleware/database/db-users";
import { USERS_COLLECT } from "../../middleware/database/db-users";
require('dotenv').config();


const TEST_EMAIL = 'tuvw@gmail.com';
const TEST_USRNM = 'tuvw';
const TEST_NEW_USRNM = 'hasjdhakljs'; 
const TEST_PW = 'cdfg';
const USER_MODEL = mongoose.model(USERS_COLLECT, userSchema);


describe('db-users', async() => {
    before(async () => {
        await dbConnect();
    });


    after(() => {
        mongoose.disconnect();
    });


    test('insertUser', async () => {
        const filt = {
            'email': TEST_EMAIL,
            'username': TEST_USRNM
        };

        await insertUser(
            TEST_EMAIL,
            TEST_USRNM,
            TEST_PW
        );

        let search = await USER_MODEL.findOne(filt);
        assert(search !== null);
        await USER_MODEL.findOneAndDelete(filt);
    });


    test('updateUsername', async () => {
        let filt = {
            'email': TEST_EMAIL,
            'username': TEST_USRNM,
            'password': TEST_PW
        };

        // create the new document
        const doc = new USER_MODEL(filt);
        await doc.save();

        console.log(await updateUsername(TEST_USRNM, TEST_NEW_USRNM));
        filt['username'] = TEST_NEW_USRNM;

        let search = await USER_MODEL.findOne(filt);
        assert(search !== null);
        await USER_MODEL.findOneAndDelete(filt);
    });


    test('verifyPassword', async () => {
        const hash = await argon2.hash(
            TEST_PW,
            {secret: Buffer.from(`${process.env.ARGON2_SECRET}`)}
        );

        let filt = {
            'email': TEST_EMAIL,
            'username': TEST_USRNM,
            'password': hash
        };

        // create the new document
        const doc = new USER_MODEL(filt);
        await doc.save();

        assert(await verifyPassword(TEST_EMAIL, TEST_USRNM, TEST_PW));
        await USER_MODEL.findOneAndDelete(filt);
    });
})