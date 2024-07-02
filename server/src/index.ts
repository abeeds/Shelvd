import express from 'express';
import logger from './utils/logger';
import routes from './utils/routes';
import db_connect from './utils/db-connect';


const app = express();
const PORT = 3000;


app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}.`);
    db_connect();

    routes(app);    // all endpoints defined here
});