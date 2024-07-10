import mongoose, { Schema } from "mongoose";
import logger from '../logger';
require('dotenv').config();


const LOCAL_STRING = "mongodb://localhost:27017";
const DB_NAME = "Shelvd";


export default async function dbConnect() {
    if(mongoose.connection.readyState === 0) {
        logger.info('Connecting to DB because it is disconnected.');
        var connection_string:string;

        // define the connection_string by checking CLOUD_MONGO
        // if 0 or undefined: local
        // if 1: cloud
        if(process.env.CLOUD_MONGO !== undefined && process.env.CLOUD_MONGO === '1') {
            logger.info('Connecting to CLOUD database.');
            connection_string = `${process.env.CLOUD_STRING}`;
        }
        else {
            if(process.env.CLOUD_MONGO === undefined) {
                logger.warn('CLOUD_MONGO not defined in the `.env`.');
            }

            logger.info('Connecting to LOCAL database.');
            connection_string = LOCAL_STRING;
        }

        try{
            connection_string += `/${DB_NAME}`;
            await mongoose.connect(connection_string);
        }
        catch {
            logger.error('Failed to connect to DB.');
            logger.error('Please check that the DB is running '
                + 'and the provided connection strings are correct.')
        }

        logger.info(`readyState: ${mongoose.connection.readyState}.`);
    }
}


export async function insertOne<T extends Document>(
    collection_name: string,
    schema: Schema, 
    object: Record<string, any>
) {
    dbConnect();

    if (mongoose.connection.readyState === 1) {
        try {
            const my_model = mongoose.model<T>(collection_name, schema);
            const new_document = new my_model(object);
            return await new_document.save();
        } catch (error) {
            logger.error('Could not save the document:', error);
            return null;
        }
    } else {
        logger.error('Could not insert one. DB is disconnected.');
        return null;
    }
}


/*
    returns a promise of docments satisfying the search
    the object's keys are the documents' ids\
    need to use await to actually get results
*/
export async function findMany<T extends Document> (
    collection_name: string,
    schema: Schema,
    search_params: Record<string, any>={},
    sort: Record<string, any>={},
    limit: number=25,
    skip: number=0
) {
    dbConnect();

    if (mongoose.connection.readyState === 1) {
        const my_model = mongoose.model<T>(collection_name, schema);
        let output: { [key: string]: T} = {};
        
        let query = my_model.find();
        if(Object.keys(search_params).length > 0) {
            query = my_model.find(search_params);
        }

        query = query.sort(sort).limit(limit).skip(skip);
        let results = await query.exec();

        results.forEach(doc => {
            output[doc._id.toString()] = doc.toObject();
        })
        return output;
    } else {
        logger.error('Could not search. DB is disconnected.');
        return null;
    }
}
