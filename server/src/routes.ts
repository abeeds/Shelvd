import { Express, Request, Response } from "express";
import mongoose from "mongoose";
import { getUsers, insertUser } from "./middleware/database/db-users";
import logger from "./utils/logger";


function routes(app: Express) {
    app.get('/test/hello_world', (req: Request, res: Response) => {
        logger.info(`${req.socket.remoteAddress}: /test/hello_world`);

        res.status(200).send('Hello World!');
    })


    // test/user
    app.get('/test/user', async (req: Request, res: Response) => {
        logger.info(`[${req.socket.remoteAddress}] [GET] [/test/user]`);
        try{
            const users = await getUsers();
            res.status(200).send(users);
            logger.info(`[${req.socket.remoteAddress}] [GET] [/test/user] ` 
                + `Success.`
            );
        }
        catch(error) {
            logger.error(`[${req.socket.remoteAddress}] [GET] [/test/user]: `
                + error);
            res.status(500).send();
        }
        
    })

    /*
        TODO
        return error if username/email are already taken
    */
    app.post('/test/user', (req: Request, res: Response) => {
        logger.info(`[${req.socket.remoteAddress}] [POST] [/test/user]`);
        const username: string = req.body.username;
        const email: string = req.body.email;
        const password: string = req.body.password;
        
        try {
            insertUser(username, email, password);
            logger.info(`[${req.socket.remoteAddress}] [POST] [/test/user]: `
                        + `Created user successfully.`);

            res.status(200).send();
        } catch(error) {
            logger.error(`[${req.socket.remoteAddress}] [POST] [/test/user]: `
                + error);

            res.status(500).send();
        };
    })
}


export default routes;