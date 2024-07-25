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
const MY_MODEL = mongoose.model(USERS_COLLECT, userSchema);


describe('db-connect', async () => {
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
        
        let search = await MY_MODEL.findOne(filt);
        assert(search !== null);

        // cleanup
        await MY_MODEL.findOneAndDelete(filt);
    });


    test('updateOne', async () => {
        let filt = {
            'email': TEST_EMAIL,
            'username': TEST_USRNM,
            'password': TEST_PW
        };

        // create the new document
        const MY_MODEL = mongoose.model(USERS_COLLECT, userSchema);
        const doc = new MY_MODEL(filt);
        await doc.save();


        await updateOne(
            USERS_COLLECT,
            userSchema,
            filt,
            {'username': TEST_NEW_USRNM}
        );

        filt['username'] = TEST_NEW_USRNM;

        // make sure the update worked
        let search = await MY_MODEL.findOne(filt);
        assert(search !== null);

        // cleanup
        await MY_MODEL.findOneAndDelete(filt);
    });


    test('deleteOne', async () => {
        let filt = {
            'email': TEST_EMAIL,
            'username': TEST_USRNM,
            'password': TEST_PW
        };

        // create the new document
        const MY_MODEL = mongoose.model(USERS_COLLECT, userSchema);
        const doc = new MY_MODEL(filt);
        await doc.save();

        await deleteOne(
            USERS_COLLECT,
            userSchema, 
            filt
        );

        let search = await MY_MODEL.findOne(filt);
        assert(search === null);
    })
});
