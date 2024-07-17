import express from 'express';
import logger from './utils/logger';
import routes from './routes/routes';
import { dbConnect } from './middleware/database/db-connect';


const PORT = 3000;
const app = express();
app.use(express.json());


app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}.`);
    dbConnect();

    routes(app);    // all endpoints defined here
});