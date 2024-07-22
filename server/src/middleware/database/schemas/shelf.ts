import { Schema, Document } from "mongoose";


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