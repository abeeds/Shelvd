import mongoose, { Schema, Document } from "mongoose";
import { SHELF_COLLECT } from "../db-shelves";


interface shelf extends Document {
    owner: string; // id of owner
    name: string;
    description: string;
    creationDate: Date;
    parent: string; // id of parent shelf
};


export const shelfSchema = new Schema<shelf>({
    owner: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    creationDate: { type: Date, default: Date.now },
    parent: { type: String }
});


shelfSchema.index({
        owner: 1,
        name: 1
    }, {
        unique: true
    }
);


const SHELF_MODEL = mongoose.model(SHELF_COLLECT, shelfSchema);
export default SHELF_MODEL;