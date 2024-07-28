import mongoose, { Schema, Document } from "mongoose";
import { USERS_COLLECT } from "../db-users";


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


const USER_MODEL = mongoose.model(USERS_COLLECT, userSchema);
export default USER_MODEL;