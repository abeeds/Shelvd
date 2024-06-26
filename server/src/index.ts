import express from 'express';
import log from './utils/logger'


const app = express();
const PORT = 3000;


app.listen(PORT, () => {
    log.info(`Server is running on https://localhost:${PORT}`);
});