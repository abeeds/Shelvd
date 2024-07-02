import mongoose, { ConnectionStates } from "mongoose";
import logger from './logger';
require('dotenv').config();


const DB_NAME = "Shelvd";
const LOCAL_STRING = "mongodb://localhost:27017";


export default async function db_connect() {
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
