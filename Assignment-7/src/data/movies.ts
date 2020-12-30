// const uuid = require('uuid/v4');uuid
import { ObjectID, ObjectId } from "mongodb";

import { App } from "../mongo.helper";

const moviesCollection = () => {
    return App.MongoHelper.client.db('Gupta-Priya-CS554-Lab1').collection('movies');
  }

  async function getAllMoviess(skip: number, take: number) {
    const moviesColl = await moviesCollection();

    return await moviesColl.find({}).skip(skip).limit(take).toArray();
}

  const getMovieById = async (id: ObjectId) : Promise<Object> => {
    const moviesColl = await moviesCollection();
    if(typeof id !="object"){
        id  = ObjectId.createFromHexString(id);
    }

    const movie : Object = await moviesColl.findOne({_id: id});
    if (!movie) throw 'movie not found';
    return movie;
}

function isValid(datavalue,data){
    if(datavalue != " " && datavalue!=undefined && typeof datavalue === "string"){
    return datavalue;
    }
    throw `${datavalue} is not a valid input, you must provide valid input for ${data}`;
}

interface castObject {
"cast": [{firstName: string, lastName: string}],
}

interface infoObject{
    "info": {director: string, yearReleased: number}
}


const addMovie = async (title : string,cast : castObject,info:infoObject,plot : string, rating:number) : Promise<Object> => {

    if (!title || !cast || !info || !plot || !rating) throw 'input data is not provided';
    if(typeof title !== "string") throw 'title must be in string';
    if(typeof rating !== "number") throw 'rating must be in number';
    if(typeof plot !== "string") throw 'plot must be in string';

    if(!Array.isArray(cast) || cast.length <=0) throw 'cast data is missing';
   for(let i=0; i<cast.length; i++)
   {
       console.log(typeof cast[i]['firstName']);
    if(typeof cast[i]['firstName'] !== 'string'){
        isValid(cast[i]['firstName'], "first Name");
    }
    if(typeof cast[i]['lastName'] !== 'string'){
        isValid(cast[i]['lastName'], "last Name");
   }}
    if(typeof info !== "object" || Object.keys(info).length === 0) throw 'not valid info data';
    // if(typeof info.director !== "string") throw "director name must be in string";
    if(info['director']){
        isValid(info['director'], "director");
       }
    if(info['yearReleased']){
        if(typeof info['yearReleased'] !== "number") throw "yearReleased name must be in number";
       }
   

    const moviesColl = await moviesCollection();

    let newMovie : Object = {
        title: title, 
        cast: cast,
        info: info,
        plot: plot,
        rating: rating,
        comments:[]
    };

    const insertedMovie : any = await moviesColl.insertOne(newMovie);
    if (insertedMovie.insertedCount === 0) throw 'Insert failed!';

    return await getMovieById(insertedMovie.insertedId);
}

const updateMovie = async(movie_id: ObjectId,title : string,cast : castObject,info:infoObject,plot : string, rating:number):Promise<Object> =>{

    if (!title || !cast || !info || !plot || !rating) throw 'input data is not provided';
    if(typeof title !== "string") throw 'title must be in string';
    if(typeof rating !== "number") throw 'rating must be in number';
    if(typeof plot !== "string") throw 'plot must be in string';

    if(!Array.isArray(cast) || cast.length <=0) throw 'cast data is missing';
   for(let i=0; i<cast.length; i++)
   {
    if(typeof cast[i]['firstName'] !== 'string'){
        isValid(cast[i]['firstName'], "first Name");
    }
    if(typeof cast[i]['lastName'] !== 'string'){
        isValid(cast[i]['lastName'], "last Name");
   }}
    if(typeof info !== "object" || Object.keys(info).length === 0) throw 'not valid info data';

    if(info['director']){
        isValid(info['director'], "director");
       }
    if(info['yearReleased']){
        if(typeof info['yearReleased'] !== "number") throw "yearReleased name must be in number";
       }
   

    const moviesColl = await moviesCollection();

    if(typeof movie_id !="object"){
        movie_id  = ObjectId.createFromHexString(movie_id);
       }
        let updatedmovie:Object = {
            title: title, 
            cast: cast,
            info: info,
            plot: plot,
            rating: rating
        };
    const updatedInfo = await moviesColl.updateOne({ _id: movie_id }, { $set: updatedmovie });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update movie successfully';
    }

    return await getMovieById(movie_id);

}

const patchMovie = async(id:ObjectId, updatedMovie:any): Promise<Object> =>{
    const movieColl = await moviesCollection();

    const updatedMovietData: any ={};

    if (updatedMovie.title) {
        if(typeof updatedMovie.title !=="string") throw 'titile msut be in String';
        updatedMovietData.title = updatedMovie.title;
    }

    if (updatedMovie.cast) {
       if(!Array.isArray(updatedMovie.cast) || updatedMovie.cast.length <=0) throw 'cast data is missing';
        for(let i=0; i<updatedMovie.cast.length; i++)
        {
            if(updatedMovie.cast[i].firstName){
            isValid(updatedMovie.cast[i].firstName , "first name");}
            if(updatedMovie.cast[i].lastName){
            isValid(updatedMovie.cast[i].lastName, "last name")};
        }
      updatedMovietData.cast = updatedMovie.cast;
    }

    if (updatedMovie.info) {
        if(typeof updatedMovie.info !== "object" || Object.keys(updatedMovie.info).length === 0) throw 'not valid info data';
        if(updatedMovie.info.director){
            isValid(updatedMovie.info.director, "director");
        }
        if(updatedMovie.info.yearReleased){
            if(typeof updatedMovie.info.yearReleased !== "number") throw "yearReleased name must be in number";}
        updatedMovietData.info = updatedMovie.info;
    }

    if (updatedMovie.plot) {
        if(typeof updatedMovie.plot !=="string") throw 'plot msut be in String';
        updatedMovietData.plot = updatedMovie.plot;
    }
    if (updatedMovie.rating) {
        if(typeof updatedMovie.rating !=="number") throw 'rating msut be in number';
        updatedMovietData.rating = updatedMovie.rating;
      }
    
      if(typeof id !=="object"){
          id = ObjectId.createFromHexString(id);
      }
      const updatedInfo = await movieColl.updateOne({ _id: id }, { $set: updatedMovietData });
      if (updatedInfo.modifiedCount === 0) {
          throw 'could not update movie successfully';
      }
    // await movieColl.updateOne({ _id: id }, { $set: updatedMovietData });

    return await getMovieById(id);
}


const addComment = async (movieId: ObjectId, name:string, comment:string):Promise<Object> =>{

    if (!movieId || !name || !comment) throw 'input data is not provided';
    if(typeof name !== "string") throw 'name must be String';
    if(typeof comment !== "string") throw 'comment must be stirng';

    const moviesColl = await moviesCollection();

   const newId =new  ObjectId();
   let newComment = {
       id: newId,
       name: name, 
       comment: comment
   };
   if(typeof movieId !="object"){
       movieId  = ObjectId.createFromHexString(movieId);
   }

   const insertCommentInfo = await moviesColl.updateOne({_id: movieId}, {$addToSet: {comments: newComment}});

   if (insertCommentInfo.modifiedCount === 0) throw 'Could not add comment';

   return await getMovieById(movieId);

}

interface movieObject{
    title: string, 
    cast: Array<Object>,
    info: Object,
    plot: string,
    rating: number,
    comments:Array<Object>
}

const removeComment = async(movieId:ObjectId, commentId:ObjectId): Promise<Object>=>{
    if(!movieId || !commentId) throw 'input data is not correct';

    if(typeof movieId != "object"){
        movieId = ObjectId.createFromHexString(movieId);
    }

    if(typeof commentId != "object"){
        commentId = ObjectId.createFromHexString(commentId);
    }

    const movieColl = await moviesCollection();

    //check if comment exist or not.
    const movie : movieObject = await movieColl.findOne({_id: movieId});
    // console.log(movie.comments)
   
    let i: number = 0
    let idExists: boolean = false
    console.log(JSON.stringify(movie.comments[1]['id']));
    console.log(JSON.stringify(commentId))
    for (i = 0; i< movie.comments.length;  i++){
    if (JSON.stringify(movie.comments[i]['id']) === JSON.stringify(commentId)){
        idExists = true
        break;
    }}
    // console.log(idExists);
    if(!idExists){
        throw `eneterd comment id ${commentId} does not exists.`
    }
    const updateInfo = await movieColl.updateOne(
        { _id: movieId },
        { $pull: { comments: { id: commentId } } }
      );
      if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'could not remove the comment';

    return getMovieById(movieId);
}

 

module.exports = {
     getAllMoviess,
     getMovieById,
     addMovie,
     updateMovie,
     patchMovie,
     addComment,
     removeComment
     
}