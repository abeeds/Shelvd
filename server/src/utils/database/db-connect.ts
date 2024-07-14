import mongoose, { Schema } from "mongoose";
import logger from '../logger';
require('dotenv').config();


const LOCAL_STRING = "mongodb://localhost:27017";
const DB_NAME = "Shelvd";


export default async function dbConnect() {
    if(mongoose.connection.readyState === 0) {
        logger.info('[dbConnect] Connecting to DB because it is disconnected.');
        var connection_string:string;

        // define the connection_string by checking CLOUD_MONGO
        // if 0 or undefined: local
        // if 1: cloud
        if(process.env.CLOUD_MONGO !== undefined && process.env.CLOUD_MONGO === '1') {
            logger.info('[dbConnect] Connecting to CLOUD database.');
            connection_string = `${process.env.CLOUD_STRING}`;
        }
        else {
            if(process.env.CLOUD_MONGO === undefined) {
                logger.warn('[dbConnect] CLOUD_MONGO not defined in the `.env`.');
            }

            logger.info('[dbConnect] Connecting to LOCAL database.');
            connection_string = LOCAL_STRING;
        }

        try{
            connection_string += `/${DB_NAME}`;
            await mongoose.connect(connection_string);
        }
        catch {
            logger.error('[dbConnect] Failed to connect to DB.');
            logger.error('[dbConnect] Please check that the DB is running '
                + 'and the provided connection strings are correct.')
        }

        logger.info(`[dbConnect] readyState: ${mongoose.connection.readyState}.`);
    }
}


export async function insertOne<T extends Document>(
    collection_name: string,
    schema: Schema, 
    object: Record<string, any>
) {
    dbConnect();

    if (mongoose.connection.readyState === 1) {
        const my_model = mongoose.model<T>(collection_name, schema);
        const new_document = new my_model(object);
        return await new_document.save();
    } else {
        logger.error('[insertOne] Could not insert one. DB is disconnected.');
        return null;
    }
}


/*
    Returns a promise of a single document satisfying the search.
    The document is returned as an object.
    - need to use await to actually get results
    TODO: allow limiting to only specific fields
*/
export async function findOne<T extends Document> (
    collection_name: string,
    schema: Schema,
    search_params: Record<string, any>
) {
    dbConnect();

    if (mongoose.connection.readyState === 1) {
        const my_model = mongoose.model<T>(collection_name, schema);
        let output: { [key: string]: T} = {};
        let query = my_model.findOne(search_params);
        let result = await query.exec();

        if(result !== null) {
            output = result.toObject();
        }

        return output;
    } else {
        logger.error('[findOne] Could not search. DB is disconnected.');
        return null;
    }
}


/*
    Returns a promise of documents satisfying the search.
    The documents are returned as an object where the
    the sub-object's keys are the _id fields of the objects.
    - need to use await to actually get results
*/
export async function findMany<T extends Document> (
    collection_name: string,
    schema: Schema,
    search_params: Record<string, any>={},
    select: string='',
    sort: Record<string, any>={},
    limit: number=25,
    skip: number=0
) {
    dbConnect();

    if (mongoose.connection.readyState === 1) {
        const my_model = mongoose.model<T>(collection_name, schema);
        let output: { [key: string]: T} = {};

        let query = await my_model
            .find(search_params)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .select(select)
            .exec();

        // turn query into an object
        query.forEach(doc => {
            output[doc._id.toString()] = doc.toObject();
        })
        return output;
    } else {
        logger.error('[findMany] Could not search. DB is disconnected.');
        return null;
    }
}


/*
    Finds a document based on the filters provided and updates
    it with the values provided in update_obj
    Returns true or false depending on whether it updated or not
*/
export async function updateOne<T extends Document>(
    collection_name: string,
    schema: Schema,
    filter: Record<string, any>,
    update_obj: Record<string, any>
) {
    dbConnect();
    if (mongoose.connection.readyState === 1) {
        const my_model = mongoose.model<T>(collection_name, schema);
        return await my_model.findOneAndUpdate(filter, update_obj, {new: true}) !== null;
    }
    else {
        logger.error('[updateOne] Could not update. DB is disconnected');
        return null;
    }
}


/*
    Deletes a doc with the provided filter
    Returns true or false depending on whether it was deleted or not
*/
export async function deleteOne<T extends Document>(
    collection_name: string,
    schema: Schema,
    filter: Record<string, any>
) {
    const my_model = mongoose.model<T>(collection_name, schema);
    return await my_model.findOneAndDelete(filter) !== null;
}