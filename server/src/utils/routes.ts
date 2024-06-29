import { Express, Request, Response } from "express";


function routes(app: Express) {
    app.get('/test', (req: Request, res: Response) => {
        res.status(200).send('Hello World!');
    })    
}


export default routes;