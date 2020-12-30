import * as express from 'express';
import { Request, Response } from 'express';
import { Movies } from './routes/movieRoutes';



class App {
    public app: express.Application;
    public moviesRoutes: Movies = new Movies();
    public pathsAccessed: Object = {};

    constructor() {
        this.app = express();
        this.config();
        this.moviesRoutes.routes(this.app);
    }

    totalReq: number = 0
    LoggerOne = (req: Request, res: Response, next: Function) => {

        this.totalReq += 1; 
        console.log("==========REQUEST Detail==========");
        console.log("Request HTTP Verb: " + req.method +"  " +"Request Url: " +"http://localhost:3000"+req.originalUrl +"  "+"Request Body: " + JSON.stringify(req.body) );
        next()
    }

    LoggingNoofRequest = (req: Request, res: Response, next: Function) => {
        if (!this.pathsAccessed[req.path]) this.pathsAccessed[req.path] = 0;
        this.pathsAccessed[req.path]++;
        console.log("Total " + this.pathsAccessed[req.path] + " request has been made to " +"http://localhost:3000"+req.path);
        next();
    }


    private config(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.LoggerOne);
        this.app.use(this.LoggingNoofRequest);

    }


}

export default new App().app;