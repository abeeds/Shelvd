import assert from "node:assert";
import test from "node:test";
import mongoose from "mongoose";
import { after, before, describe } from "node:test";
import { dbConnect } from "../../middleware/database/db-connect";
import { userSchema } from "../../middleware/database/schemas/user";
import { insertUser, updateUsername } from "../../middleware/database/db-users";
import { USERS_COLLECT } from "../../middleware/database/db-users";


const TEST_EMAIL = 'qrst@gmail.com';
const TEST_USRNM = 'qrst';
const TEST_NEW_USRNM = 'uvwx'; 
const TEST_PW = 'cdfg';
const MY_MODEL = mongoose.model(USERS_COLLECT, userSchema);


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

        let search = await MY_MODEL.findOne(filt);
        assert(search !== null);
    });


    test('updateUsername', async () => {
        const filt = {
            'email': TEST_EMAIL,
            'username': TEST_NEW_USRNM
        };

        assert(await updateUsername(TEST_USRNM, TEST_NEW_USRNM));

        let search = await MY_MODEL.findOne(filt);
        assert(search !== null);
    });
})