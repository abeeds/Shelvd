import express from 'express';
import log from './utils/logger';
import routes from './utils/routes';



const app = express();
const PORT = 3000;


app.listen(PORT, () => {
    log.info(`Server is running on http://localhost:${PORT}`);

    // all endpoints defined here
    routes(app);
});