import { Schema, Document } from "mongoose";
import { StringValidation } from "zod";


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