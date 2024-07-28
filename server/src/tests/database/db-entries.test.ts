import assert from "node:assert";
import test from "node:test";
import mongoose from "mongoose";
import { after, before, describe } from "node:test";
import { dbConnect } from "../../middleware/database/db-connect";
import { deleteEntry, ENTRY_COLLECT, insertEntry } from "../../middleware/database/db-entries";
import { entrySchema } from "../../middleware/database/schemas/entry";


const ENTRY_MODEL = mongoose.model(ENTRY_COLLECT, entrySchema);
const TEST_API = 'Book';
const TEST_API_ID = 'a1b2c3';
const TEST_IMG_ID = 'q9r8s7';
const TEST_NAME = 'The Way of Kings';


describe('db-entries', async() => {
    before(async () => {
        await dbConnect();
    });


    after(() => {
        mongoose.disconnect();
    });


    test('insertEntry', async () => {
        const filt = {
            api: TEST_API,
            api_id: TEST_API_ID,
            img_id: TEST_IMG_ID,
            name: TEST_NAME,
        };

        await insertEntry(
            TEST_API,
            TEST_API_ID,
            TEST_IMG_ID, 
            TEST_NAME
        );

        let search = await ENTRY_MODEL.findOne(filt);
        assert(search !== null);
        await ENTRY_MODEL.findOneAndDelete(filt);
    });


    test('deleteEntry', async () => {
        const filt = {
            api: TEST_API,
            api_id: TEST_API_ID,
            img_id: TEST_IMG_ID,
            name: TEST_NAME,
        };

        const doc = new ENTRY_MODEL(filt);
        await doc.save();

        await deleteEntry(TEST_API, TEST_API_ID);

        let search = await ENTRY_MODEL.findOne(filt);
        assert(search === null);
    });
});