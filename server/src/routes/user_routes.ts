import { Express, Request, Response } from "express";
import { doesUserExist, getUsers, insertUser, verifyPassword } from "../middleware/database/db-users";
import logger from "../utils/logger";


function userRoutes(app: Express) {
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
        expects: email, username, password
        TODO: return error if username/email are already taken
    */
    app.post('/test/user', (req: Request, res: Response) => {
        logger.info(`[${req.socket.remoteAddress}] [POST] [/test/user]`);
        const username: string = req.body.username;
        const email: string = req.body.email;
        const password: string = req.body.password;
        
        try {
            insertUser(username, email, password);
            logger.info(`[${req.socket.remoteAddress}] [POST] [/test/user]: `
                        + `Success.`);

            res.status(200).send();
        } catch(error) {
            logger.error(`[${req.socket.remoteAddress}] [POST] [/test/user]: `
                + error);

            res.status(500).send();
        };
    })

    // expects either username or email and password
    // can put both username and email for a more strict check
    // currently just checks if password matches the recorded one
    app.post('/test/user/login', async (req: Request, res: Response) => {
        logger.info(`[${req.socket.remoteAddress}] [POST] [/test/user/login]`);

        const username = req.body.username !== undefined ? req.body.username : '';
        const email = req.body.email !== undefined ? req.body.email : '';
        const password = req.body.password;

        try {
            let result = await verifyPassword(email, username,password);
            if(result) {
                logger.info(`[${req.socket.remoteAddress}] [POST] [/test/user/login] ` + 
                    `Password verified.`
                );
                res.status(200).send();
            } else {
                logger.info(`[${req.socket.remoteAddress}] [POST] [/test/user/login] ` + 
                    `Password does not match.`
                );
                res.status(404).send();
            }
        } catch (error) {
            logger.error(`[${req.socket.remoteAddress}] [POST] [/test/user/login]: `
                + error);

            res.status(500).send();
        }
    })
}

export default userRoutes;