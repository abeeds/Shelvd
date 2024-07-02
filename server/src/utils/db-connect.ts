import mongoose, { ConnectionStates } from "mongoose";
import logger from './logger';
require('dotenv').config();


const DB_NAME = "Shelvd";
const LOCAL_STRING = "mongodb://localhost:27017";


async function db_connect() {
    if(mongoose.connection.readyState === 0) {
        logger.info('Connecting to DB because it is disconnected');

        // check CLOUD_MONGO env var
        // if 1 use cloud string
        // if 0 or undefined use local
        if(process.env.CLOUD_MONGO !== undefined && process.env.CLOUD_MONGO === '1') {
            logger.info('Connecting to CLOUD database.');
            await mongoose.connect(`${process.env.CLOUD_STRING}`);
        }
        else {
            if(process.env.CLOUD_MONGO === undefined) {
                logger.warn('CLOUD_MONGO not defined in environment variables.');
            }

            logger.info(`Connecting to LOCAL database.`);
            await mongoose.connect(LOCAL_STRING);
        }

        if(mongoose.connection.readyState === 0) {
            logger.error(`Failed to connect to db`);
        }
        else {
            logger.info(`readyState: ${mongoose.connection.readyState}`);
        }
    }
}

export default db_connect;