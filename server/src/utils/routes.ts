import { Express, Request, Response } from "express";
import mongoose from "mongoose";
import { getUsers, insertUser } from "./database/db-users";
import logger from "./logger";


function routes(app: Express) {
    app.get('/test/hello_world', (req: Request, res: Response) => {
        logger.info(`${req.socket.remoteAddress}: /test/hello_world`);

        res.status(200).send('Hello World!');
    })


    // test/user
    app.get('/test/user', async (req: Request, res: Response) => {
        logger.info(`[${req.socket.remoteAddress}] [GET] [/test/user]`);
        const users = await getUsers();
        res.status(200).send(users);
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
        
        if(mongoose.connection.readyState !== 1) {
            logger.error(`[${req.socket.remoteAddress}] [POST] [/test/user]: `
                + `Failed to connect to the database.`);

            res.status(500).send(`Failed to connect to the database.`);
            return;
        }

        if(insertUser(username, email, password) !== null) {
            logger.info(`[${req.socket.remoteAddress}] [POST] [/test/user]: `
                + `Created user successfully.`);

            res.status(200).send();
        }
        else {
            logger.error(`[${req.socket.remoteAddress}] [POST] [/test/user]: `
                + `Could not insert user`);

            res.status(500).send(`Something went wrong.`)
        }
    })
}


export default routes;