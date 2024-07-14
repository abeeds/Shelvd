import { Express, Request, Response } from "express";
import userRoutes from "./user_routes";
import logger from "../utils/logger";


function routes(app: Express) {
    userRoutes(app);

    // test endpoint to show that the server is working.
    app.get('/test/hello_world', (req: Request, res: Response) => {
        logger.info(`${req.socket.remoteAddress}: /test/hello_world`);

        res.status(200).send('Hello World!');
    })
}


export default routes;