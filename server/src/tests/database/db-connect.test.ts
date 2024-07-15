import assert from "node:assert";
import test from "node:test";
import { describe, after } from "node:test";
import { userSchema } from "../../middleware/database/schemas/user";
import { dbConnect, insertOne } from "../../middleware/database/db-connect";
import mongoose from "mongoose";
import { USERS_COLLECT } from "../../middleware/database/db-users";

const TEST_EMAIL = 'qrst@gmail.com'
const TEST_USRNM = 'qrst'
const TEST_PW = 'cdfg'


describe('tests', async () => {
    after(async () => {
        await mongoose.disconnect();
    });


    test('dbConnect', async () => {
        await dbConnect();
        assert.strictEqual(mongoose.connection.readyState, 1);
    });


    test('insertOne', async () => {
        const filt = {
            'email': TEST_EMAIL,
            'username': TEST_USRNM,
            'password': TEST_PW
        }

        await insertOne(
            USERS_COLLECT,
            userSchema,
            filt
        );

        const my_model = mongoose.model(USERS_COLLECT, userSchema);
        let search = await my_model.findOne(filt).exec();
        assert(search !== null);
        await my_model.findOneAndDelete(filt).exec();
    });
}); 


