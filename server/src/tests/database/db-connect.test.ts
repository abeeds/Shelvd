import assert from "node:assert";
import test from "node:test";
import { dbConnect } from "../../middleware/database/db-connect";
import mongoose from "mongoose";


test('dbConnect', async () => {
    await dbConnect();
    assert.strictEqual(mongoose.connection.readyState, 1);
    mongoose.disconnect();
});