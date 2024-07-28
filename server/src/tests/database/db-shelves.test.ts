import assert from "node:assert";
import test from "node:test";
import mongoose from "mongoose";
import { after, before, describe } from "node:test";
import { dbConnect } from "../../middleware/database/db-connect";
import { insertShelf, SHELF_COLLECT } from "../../middleware/database/db-shelves";
import { shelfSchema } from "../../middleware/database/schemas/shelf";
require('dotenv').config();


const SHELF_MODEL = mongoose.model(SHELF_COLLECT, shelfSchema);
const TEST_OWNER = 'Jasnah Kholin';
const TEST_NAME = 'History';
const TEST_DESCRIPTION = 'Aharietiam';


describe('db-shelves', async() => {
    before(async () => {
        await dbConnect();
    });


    after(() => {
        mongoose.disconnect();
    });


    test('insertShelf', async () => {
        const filt = {
            owner: TEST_OWNER,
            name: TEST_NAME,
            description: TEST_DESCRIPTION
        }

        await insertShelf(
            TEST_OWNER,
            TEST_NAME,
            TEST_DESCRIPTION
        );

        let search = await SHELF_MODEL.findOne(filt);
        assert(search !== null);
        await SHELF_MODEL.findOneAndDelete(filt);
    });
});