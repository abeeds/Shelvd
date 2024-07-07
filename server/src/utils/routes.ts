import { Express, Request, Response } from "express";
import { insertUser } from "./database/db-users";
import logger from "./logger";


function routes(app: Express) {
    app.get('/test/hello_world', (req: Request, res: Response) => {
        logger.info(`${req.socket.remoteAddress} is calling /test/hello_world`);
        
        res.status(200).send('Hello World!');
    })

    app.post('/test/user', (req: Request, res: Response) => {
        logger.info(`${req.socket.remoteAddress} is calling /test/user`);
        const username: string = req.body.username;
        const email: string = req.body.email;
        const password: string = req.body.password;

        logger.info(`email: ${email}, username: ${username}, password: ${password}`)
        res.status(200).send();
    })
}


export default routes;