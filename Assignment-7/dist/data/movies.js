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
// const uuid = require('uuid/v4');uuid
const mongodb_1 = require("mongodb");
const mongo_helper_1 = require("../mongo.helper");
const moviesCollection = () => {
    return mongo_helper_1.App.MongoHelper.client.db('Gupta-Priya-CS554-Lab1').collection('movies');
};
function getAllMoviess(skip, take) {
    return __awaiter(this, void 0, void 0, function* () {
        const moviesColl = yield moviesCollection();
        return yield moviesColl.find({}).skip(skip).limit(take).toArray();
    });
}
const getMovieById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const moviesColl = yield moviesCollection();
    if (typeof id != "object") {
        id = mongodb_1.ObjectId.createFromHexString(id);
    }
    const movie = yield moviesColl.findOne({ _id: id });
    if (!movie)
        throw 'movie not found';
    return movie;
});
function isValid(datavalue, data) {
    if (datavalue != " " && datavalue != undefined && typeof datavalue === "string") {
        return datavalue;
    }
    throw `${datavalue} is not a valid input, you must provide valid input for ${data}`;
}
const addMovie = (title, cast, info, plot, rating) => __awaiter(void 0, void 0, void 0, function* () {
    if (!title || !cast || !info || !plot || !rating)
        throw 'input data is not provided';
    if (typeof title !== "string")
        throw 'title must be in string';
    if (typeof rating !== "number")
        throw 'rating must be in number';
    if (typeof plot !== "string")
        throw 'plot must be in string';
    if (!Array.isArray(cast) || cast.length <= 0)
        throw 'cast data is missing';
    for (let i = 0; i < cast.length; i++) {
        console.log(typeof cast[i]['firstName']);
        if (typeof cast[i]['firstName'] !== 'string') {
            isValid(cast[i]['firstName'], "first Name");
        }
        if (typeof cast[i]['lastName'] !== 'string') {
            isValid(cast[i]['lastName'], "last Name");
        }
    }
    if (typeof info !== "object" || Object.keys(info).length === 0)
        throw 'not valid info data';
    // if(typeof info.director !== "string") throw "director name must be in string";
    if (info['director']) {
        isValid(info['director'], "director");
    }
    if (info['yearReleased']) {
        if (typeof info['yearReleased'] !== "number")
            throw "yearReleased name must be in number";
    }
    const moviesColl = yield moviesCollection();
    let newMovie = {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating,
        comments: []
    };
    const insertedMovie = yield moviesColl.insertOne(newMovie);
    if (insertedMovie.insertedCount === 0)
        throw 'Insert failed!';
    return yield getMovieById(insertedMovie.insertedId);
});
const updateMovie = (movie_id, title, cast, info, plot, rating) => __awaiter(void 0, void 0, void 0, function* () {
    if (!title || !cast || !info || !plot || !rating)
        throw 'input data is not provided';
    if (typeof title !== "string")
        throw 'title must be in string';
    if (typeof rating !== "number")
        throw 'rating must be in number';
    if (typeof plot !== "string")
        throw 'plot must be in string';
    if (!Array.isArray(cast) || cast.length <= 0)
        throw 'cast data is missing';
    for (let i = 0; i < cast.length; i++) {
        if (typeof cast[i]['firstName'] !== 'string') {
            isValid(cast[i]['firstName'], "first Name");
        }
        if (typeof cast[i]['lastName'] !== 'string') {
            isValid(cast[i]['lastName'], "last Name");
        }
    }
    if (typeof info !== "object" || Object.keys(info).length === 0)
        throw 'not valid info data';
    if (info['director']) {
        isValid(info['director'], "director");
    }
    if (info['yearReleased']) {
        if (typeof info['yearReleased'] !== "number")
            throw "yearReleased name must be in number";
    }
    const moviesColl = yield moviesCollection();
    if (typeof movie_id != "object") {
        movie_id = mongodb_1.ObjectId.createFromHexString(movie_id);
    }
    let updatedmovie = {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating
    };
    const updatedInfo = yield moviesColl.updateOne({ _id: movie_id }, { $set: updatedmovie });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update movie successfully';
    }
    return yield getMovieById(movie_id);
});
const patchMovie = (id, updatedMovie) => __awaiter(void 0, void 0, void 0, function* () {
    const movieColl = yield moviesCollection();
    const updatedMovietData = {};
    if (updatedMovie.title) {
        if (typeof updatedMovie.title !== "string")
            throw 'titile msut be in String';
        updatedMovietData.title = updatedMovie.title;
    }
    if (updatedMovie.cast) {
        if (!Array.isArray(updatedMovie.cast) || updatedMovie.cast.length <= 0)
            throw 'cast data is missing';
        for (let i = 0; i < updatedMovie.cast.length; i++) {
            if (updatedMovie.cast[i].firstName) {
                isValid(updatedMovie.cast[i].firstName, "first name");
            }
            if (updatedMovie.cast[i].lastName) {
                isValid(updatedMovie.cast[i].lastName, "last name");
            }
            ;
        }
        updatedMovietData.cast = updatedMovie.cast;
    }
    if (updatedMovie.info) {
        if (typeof updatedMovie.info !== "object" || Object.keys(updatedMovie.info).length === 0)
            throw 'not valid info data';
        if (updatedMovie.info.director) {
            isValid(updatedMovie.info.director, "director");
        }
        if (updatedMovie.info.yearReleased) {
            if (typeof updatedMovie.info.yearReleased !== "number")
                throw "yearReleased name must be in number";
        }
        updatedMovietData.info = updatedMovie.info;
    }
    if (updatedMovie.plot) {
        if (typeof updatedMovie.plot !== "string")
            throw 'plot msut be in String';
        updatedMovietData.plot = updatedMovie.plot;
    }
    if (updatedMovie.rating) {
        if (typeof updatedMovie.rating !== "number")
            throw 'rating msut be in number';
        updatedMovietData.rating = updatedMovie.rating;
    }
    if (typeof id !== "object") {
        id = mongodb_1.ObjectId.createFromHexString(id);
    }
    const updatedInfo = yield movieColl.updateOne({ _id: id }, { $set: updatedMovietData });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update movie successfully';
    }
    // await movieColl.updateOne({ _id: id }, { $set: updatedMovietData });
    return yield getMovieById(id);
});
const addComment = (movieId, name, comment) => __awaiter(void 0, void 0, void 0, function* () {
    if (!movieId || !name || !comment)
        throw 'input data is not provided';
    if (typeof name !== "string")
        throw 'name must be String';
    if (typeof comment !== "string")
        throw 'comment must be stirng';
    const moviesColl = yield moviesCollection();
    const newId = new mongodb_1.ObjectId();
    let newComment = {
        id: newId,
        name: name,
        comment: comment
    };
    if (typeof movieId != "object") {
        movieId = mongodb_1.ObjectId.createFromHexString(movieId);
    }
    const insertCommentInfo = yield moviesColl.updateOne({ _id: movieId }, { $addToSet: { comments: newComment } });
    if (insertCommentInfo.modifiedCount === 0)
        throw 'Could not add comment';
    return yield getMovieById(movieId);
});
const removeComment = (movieId, commentId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!movieId || !commentId)
        throw 'input data is not correct';
    if (typeof movieId != "object") {
        movieId = mongodb_1.ObjectId.createFromHexString(movieId);
    }
    if (typeof commentId != "object") {
        commentId = mongodb_1.ObjectId.createFromHexString(commentId);
    }
    const movieColl = yield moviesCollection();
    //check if comment exist or not.
    const movie = yield movieColl.findOne({ _id: movieId });
    // console.log(movie.comments)
    let i = 0;
    let idExists = false;
    console.log(JSON.stringify(movie.comments[1]['id']));
    console.log(JSON.stringify(commentId));
    for (i = 0; i < movie.comments.length; i++) {
        if (JSON.stringify(movie.comments[i]['id']) === JSON.stringify(commentId)) {
            idExists = true;
            break;
        }
    }
    // console.log(idExists);
    if (!idExists) {
        throw `eneterd comment id ${commentId} does not exists.`;
    }
    const updateInfo = yield movieColl.updateOne({ _id: movieId }, { $pull: { comments: { id: commentId } } });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'could not remove the comment';
    return getMovieById(movieId);
});
module.exports = {
    getAllMoviess,
    getMovieById,
    addMovie,
    updateMovie,
    patchMovie,
    addComment,
    removeComment
};
