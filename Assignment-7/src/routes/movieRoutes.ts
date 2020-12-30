import {Request, Response} from 'express';
import { request } from 'https';
import { ObjectId } from 'mongodb';
const moviesdata = require('../data/movies');
import {isEmpty} from "lodash"


export class Movies {
    public routes(app): void {
app.route('/api/movies').get(async (req: Request, res: Response) => {
    //console.log("get rt");
    try {
      let skip: any = req.query.skip;
      let take: any = req.query.take;
      
      if(skip === undefined || skip === NaN){
        skip = 0;
      }
     if(take === undefined  || take === NaN){
          take = 20;
      }
      if(skip < 0){
        res.status(400).json({error: 'input for skip is not correct'});
      }

      if(take < 0) {
        res.status(400).json({ error: 'input for take is not correct' });
        return;
      }
      if(take == 0){
        res.json([]);
        return;
      }
      else if(take>100){
          take = 100;
      }   
      take = parseInt(take);
      skip = parseInt(skip)
      let allmovies : JSON = await moviesdata.getAllMoviess(skip,take)
      res.status(200).json(allmovies);
    } catch (e) {
      res.sendStatus(500);
    }
  });

  app.route('/api/movies/:id').get(async (req: Request, res: Response) => {
    try {
      let movie: Object = await moviesdata.getMovieById(req.params.id);
      console.log(movie);
      res.status(200).json(movie);
    } catch (e) {
      res.status(404).json({error: 'movie not found'});
    }
  });

  app.route('/api/movies/').post(async (req: Request, res: Response) => {
    const movieDetailData = req.body;
    try{
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
      let movie: Object = await moviesdata.addMovie(title,cast,info,plot,rating);
      console.log(movie);
      res.status(200).json(movie);
    } catch (e) {
      res.status(404).json({error: e});
    }
  });

  app.route('/api/movies/:id').put(async (req: Request, res: Response) => {
    const movieDetailData:any = req.body;
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

    try{
      await moviesdata.getMovieById(req.params.id);
      console.log(moviesdata.getMovieById(req.params.id))
    }
    catch(e){
      res.status(404).json({error: 'Movie dont exisit in database'});
    }

    try {
      const {title, cast, info, plot, rating } = movieDetailData;
      const newMovie = await moviesdata.updateMovie(req.params.id,title,cast,info,plot,rating);
      res.json(newMovie);
    } catch (e) {
      res.status(500).json({ error: e });
    }

  });

  app.route('/api/movies/:id').patch(async (req: Request, res: Response) => {
    const requestBody:any = req.body;
    let updatedObject:any = {};
    try{
      const oldMovie = await moviesdata.getMovieById(req.params.id);

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
    catch(e){
      res.status(400).json({error: 'movie not found'})
      return;
    }
  
    try{
      // console.log(!isEmpty(updatedObject))
      if (isEmpty(updatedObject)){
        throw `no data to update in the patch request.`
      }
      const updatedMovie = await moviesdata.patchMovie(req.params.id, updatedObject);
      res.json(updatedMovie);
    }
    catch(e){
      res.status(500).json({ error: e});
    }
  });

  app.route('/api/movies/:id/comments').post(async (req: Request, res: Response) => {
    const requestData = req.body;
  if (!requestData.name) {
    res.status(400).json({ error: 'You must provide name' });
    return;
  }
  if (!requestData.comment) {
    res.status(400).json({ error: 'You must provide movie comment' });
    return;
  }
  try{
    await moviesdata.getMovieById(req.params.id);
  }
  catch(e){
    res.status(404).json({error:'movie not found'});
    return;
  }
  try{
    const movieDetail = await moviesdata.addComment(req.params.id, requestData.name, requestData.comment);
    res.json(movieDetail);
  }
  catch(e){
    res.status(500).json({error:e});
  }
  });

  app.route('/api/movies/:movieId/:commentId').delete(async (req: Request, res: Response) => {
    try{
      let movieId = req.params.movieId;
      let commentId = req.params.commentId;

      let deleteComment = await moviesdata.removeComment(movieId,commentId);
      res.json(deleteComment);
    }
    catch(e){
        res.status(500).json({ error: e });
    }
});

app.route('*').get(async (req: Request, res: Response) => {
  res.status(400).json({ error: 'Not found!'});
  
});
app.route('*').post(async (req: Request, res: Response) => {
  res.status(400).json({ error: 'Not found!'});
  
});
app.route('*').put(async (req: Request, res: Response) => {
  res.status(400).json({ error: 'Not found!'});
  
});
app.route('*').delete(async (req: Request, res: Response) => {
  res.status(400).json({ error: 'Not found!'});
  
});
app.route('*').patch(async (req: Request, res: Response) => {
  res.status(400).json({ error: 'Not found!'});
  
});
    
}} 
  