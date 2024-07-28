
import mongoose, { Schema, Document } from "mongoose";
import { ENTRY_COLLECT } from "../db-entries";


interface entry extends Document {
    api: string; // which api it is fetched from
    api_id: string; // id from that api
    img_id: string;
    name: string;
}

export const entrySchema = new Schema<entry>({
    api: { type: String, required: true },
    api_id: { type: String, required: true },
    img_id: { type: String, required: true },
    name: { type: String, required: true},
})


entrySchema.index({
        api: 1,
        api_id: 1
    } , {
        unique: true
    }
);


const ENTRY_MODEL = mongoose.model(ENTRY_COLLECT, entrySchema);
export default ENTRY_MODEL;