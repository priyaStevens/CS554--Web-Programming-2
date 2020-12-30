"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const movieRoutes_1 = require("./routes/movieRoutes");
class App {
    constructor() {
        this.moviesRoutes = new movieRoutes_1.Movies();
        this.pathsAccessed = {};
        this.totalReq = 0;
        this.LoggerOne = (req, res, next) => {
            this.totalReq += 1;
            console.log("==========REQUEST Detail==========");
            console.log("Request HTTP Verb: " + req.method + "  " + "Request Url: " + "http://localhost:3000" + req.originalUrl + "  " + "Request Body: " + JSON.stringify(req.body));
            next();
        };
        this.LoggingNoofRequest = (req, res, next) => {
            if (!this.pathsAccessed[req.path])
                this.pathsAccessed[req.path] = 0;
            this.pathsAccessed[req.path]++;
            console.log("Total " + this.pathsAccessed[req.path] + " request has been made to " + "http://localhost:3000" + req.path);
            next();
        };
        this.app = express();
        this.config();
        this.moviesRoutes.routes(this.app);
    }
    config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.LoggerOne);
        this.app.use(this.LoggingNoofRequest);
    }
}
exports.default = new App().app;
