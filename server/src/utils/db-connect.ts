import mongoose from "mongoose";
import logger from './logger';
require('dotenv').config();


const DB_NAME = "Shelvd";
const LOCAL_STRING = "mongodb://localhost:27017";


async function db_connect() {
    if(mongoose.connection.readyState === 0) {
        logger.info('Connecting to DB because it is disconnected');

        if(process.env.CLOUD_MONGO !== undefined && process.env.CLOUD_MONGO === '1') {
            logger.info('Connecting to CLOUD database.');
            await mongoose.connect(`${process.env.CLOUD_STRING}`);
        }
        else {
            logger.info(`Connecting to LOCAL database.`);
            await mongoose.connect(LOCAL_STRING);
        }

        logger.info(`mongoose.readyState: ${mongoose.connection.readyState}`)
    }
}

export default db_connect;