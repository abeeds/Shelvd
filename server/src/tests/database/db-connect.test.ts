import assert from "node:assert";
import test from "node:test";
import mongoose from "mongoose";
import { describe, after } from "node:test";
import { dbConnect, deleteOne, insertOne, updateOne } from "../../middleware/database/db-connect";
import { userSchema } from "../../middleware/database/schemas/user";
import { USERS_COLLECT } from "../../middleware/database/db-users";

const TEST_EMAIL = 'qrst@gmail.com';
const TEST_USRNM = 'qrst';
const TEST_NEW_USRNM = 'uvwx'; 
const TEST_PW = 'cdfg';


describe('tests', async () => {
    after(() => {
        mongoose.disconnect();
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
        };

        await insertOne(
            USERS_COLLECT,
            userSchema,
            filt
        );

        // make sure the insert worked
        const my_model = mongoose.model(USERS_COLLECT, userSchema);
        let search = await my_model.findOne(filt);
        assert(search !== null);

        // cleanup
        await my_model.findOneAndDelete(filt);
    });


    test('updateOne', async () => {
        let filt = {
            'email': TEST_EMAIL,
            'username': TEST_USRNM,
            'password': TEST_PW
        };

        // create the new document
        const my_model = mongoose.model(USERS_COLLECT, userSchema);
        const doc = new my_model(filt);
        await doc.save();


        await updateOne(
            USERS_COLLECT,
            userSchema,
            filt,
            {'username': TEST_NEW_USRNM}
        );

        filt['username'] = TEST_NEW_USRNM;

        // make sure the update worked
        let search = await my_model.findOne(filt);
        assert(search !== null);

        // cleanup
        await my_model.findOneAndDelete(filt);
    });


    test('deleteOne', async () => {
        let filt = {
            'email': TEST_EMAIL,
            'username': TEST_USRNM,
            'password': TEST_PW
        };

        // create the new document
        const my_model = mongoose.model(USERS_COLLECT, userSchema);
        const doc = new my_model(filt);
        await doc.save();

        await deleteOne(
            USERS_COLLECT,
            userSchema, 
            filt
        );

        let search = await my_model.findOne(filt);
        assert(search === null);
    })
});
