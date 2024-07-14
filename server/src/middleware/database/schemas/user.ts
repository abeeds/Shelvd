import { Schema, Document } from "mongoose";


interface user extends Document {
    email: string;
    username: string;
    password: string;
    creationDate: Date;
}

export const userSchema = new Schema<user>({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
});
