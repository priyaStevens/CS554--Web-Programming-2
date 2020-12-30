"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movies = void 0;
const moviesdata = require('../data/movies');
const lodash_1 = require("lodash");
class Movies {
    routes(app) {
        app.route('/api/movies').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            //console.log("get rt");
            try {
                let skip = req.query.skip;
                let take = req.query.take;
                if (skip === undefined || skip === NaN) {
                    skip = 0;
                }
                if (take === undefined || take === NaN) {
                    take = 20;
                }
                if (skip < 0) {
                    res.status(400).json({ error: 'input for skip is not correct' });
                }
                if (take < 0) {
                    res.status(400).json({ error: 'input for take is not correct' });
                    return;
                }
                if (take == 0) {
                    res.json([]);
                    return;
                }
                else if (take > 100) {
                    take = 100;
                }
                take = parseInt(take);
                skip = parseInt(skip);
                let allmovies = yield moviesdata.getAllMoviess(skip, take);
                res.status(200).json(allmovies);
            }
            catch (e) {
                res.sendStatus(500);
            }
        }));
        app.route('/api/movies/:id').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let movie = yield moviesdata.getMovieById(req.params.id);
                console.log(movie);
                res.status(200).json(movie);
            }
            catch (e) {
                res.status(404).json({ error: 'movie not found' });
            }
        }));
        app.route('/api/movies/').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const movieDetailData = req.body;
            try {
                if (!movieDetailData.title) {
                    res.status(400).json({ error: 'You must provide movie title' });
                    return;
                }
                if (!movieDetailData.cast) {
                    res.status(400).json({ error: 'You must provide movie cast' });
                    return;
                }
                if (!movieDetailData.info) {
                    res.status(400).json({ error: 'You must provide movie info' });
                    return;
                }
                if (!movieDetailData.plot) {
                    res.status(400).json({ error: 'You must provide movie plot' });
                    return;
                }
                if (!movieDetailData.rating) {
                    res.status(400).json({ error: 'You must provide movie rating' });
                    return;
                }
                const { title, cast, info, plot, rating } = movieDetailData;
                let movie = yield moviesdata.addMovie(title, cast, info, plot, rating);
                console.log(movie);
                res.status(200).json(movie);
            }
            catch (e) {
                res.status(404).json({ error: e });
            }
        }));
        app.route('/api/movies/:id').put((req, res) => __awaiter(this, void 0, void 0, function* () {
            const movieDetailData = req.body;
            if (!movieDetailData.title) {
                res.status(400).json({ error: 'You must provide movie title' });
                return;
            }
            if (!movieDetailData.cast) {
                res.status(400).json({ error: 'You must provide movie cast' });
                return;
            }
            if (!movieDetailData.info) {
                res.status(400).json({ error: 'You must provide movie info' });
                return;
            }
            if (!movieDetailData.plot) {
                res.status(400).json({ error: 'You must provide movie plot' });
                return;
            }
            if (!movieDetailData.rating) {
                res.status(400).json({ error: 'You must provide movie rating' });
                return;
            }
            try {
                yield moviesdata.getMovieById(req.params.id);
                console.log(moviesdata.getMovieById(req.params.id));
            }
            catch (e) {
                res.status(404).json({ error: 'Movie dont exisit in database' });
            }
            try {
                const { title, cast, info, plot, rating } = movieDetailData;
                const newMovie = yield moviesdata.updateMovie(req.params.id, title, cast, info, plot, rating);
                res.json(newMovie);
            }
            catch (e) {
                res.status(500).json({ error: e });
            }
        }));
        app.route('/api/movies/:id').patch((req, res) => __awaiter(this, void 0, void 0, function* () {
            const requestBody = req.body;
            let updatedObject = {};
            try {
                const oldMovie = yield moviesdata.getMovieById(req.params.id);
                if (requestBody.title && requestBody.title !== oldMovie.title)
                    updatedObject.title = requestBody.title;
                if (requestBody.cast && requestBody.cast !== oldMovie.cast)
                    updatedObject.cast = requestBody.cast;
                if (requestBody.info && requestBody.info !== oldMovie.info)
                    updatedObject.info = requestBody.info;
                if (requestBody.plot && requestBody.plot !== oldMovie.plot)
                    updatedObject.plot = requestBody.plot;
                if (requestBody.rating && requestBody.rating !== oldMovie.rating)
                    updatedObject.rating = requestBody.rating;
            }
            catch (e) {
                res.status(400).json({ error: 'movie not found' });
                return;
            }
            try {
                // console.log(!isEmpty(updatedObject))
                if (lodash_1.isEmpty(updatedObject)) {
                    throw `no data to update in the patch request.`;
                }
                const updatedMovie = yield moviesdata.patchMovie(req.params.id, updatedObject);
                res.json(updatedMovie);
            }
            catch (e) {
                res.status(500).json({ error: e });
            }
        }));
        app.route('/api/movies/:id/comments').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const requestData = req.body;
            if (!requestData.name) {
                res.status(400).json({ error: 'You must provide name' });
                return;
            }
            if (!requestData.comment) {
                res.status(400).json({ error: 'You must provide movie comment' });
                return;
            }
            try {
                yield moviesdata.getMovieById(req.params.id);
            }
            catch (e) {
                res.status(404).json({ error: 'movie not found' });
                return;
            }
            try {
                const movieDetail = yield moviesdata.addComment(req.params.id, requestData.name, requestData.comment);
                res.json(movieDetail);
            }
            catch (e) {
                res.status(500).json({ error: e });
            }
        }));
        app.route('/api/movies/:movieId/:commentId').delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let movieId = req.params.movieId;
                let commentId = req.params.commentId;
                let deleteComment = yield moviesdata.removeComment(movieId, commentId);
                res.json(deleteComment);
            }
            catch (e) {
                res.status(500).json({ error: e });
            }
        }));
        app.route('*').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(400).json({ error: 'Not found!' });
        }));
        app.route('*').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(400).json({ error: 'Not found!' });
        }));
        app.route('*').put((req, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(400).json({ error: 'Not found!' });
        }));
        app.route('*').delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(400).json({ error: 'Not found!' });
        }));
        app.route('*').patch((req, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(400).json({ error: 'Not found!' });
        }));
    }
}
exports.Movies = Movies;
