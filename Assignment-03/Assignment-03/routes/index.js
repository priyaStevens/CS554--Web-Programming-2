
const path = require('path');
const express = require('express');
const axios = require('axios');
const redis = require('redis');
const client = redis.createClient();
const redisClient = require('redis').createClient();
const CircularJSON = require('circular-json');
const bluebird = require('bluebird');
const { promisify, Promise } = require('bluebird');
const SortedSet = require('redis-sorted-set');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = app => {

  app.get('/', async (req, res, next) => {
    let cacheForHomePageExists = await client.getAsync('homePageData');
    if (cacheForHomePageExists) {
      res.send(cacheForHomePageExists);
    } else {
      next();
    }
  });
  app.get("/", async(req, res) => {
    try{
      let { data } = await (axios.get('http://api.tvmaze.com/shows'));
      
      res.render(
      "shows/homePage",
      {
        title: "Shows",
        shows: data,
      },
      async function (err, html) {
        let cacheForHomePageExists = await client.setAsync('homePageData', html);
        res.send(html);
        console.log("done cache for indiviual page");
      }
      
    );
  }
    catch(e){
      res.render('layouts/error', {title: 'Error', error: e.message });
    }
    });

  app.get("/show/:id", async(req, res, next) => {
    let id = req.params.id;
    let cacheForshowPageExists = await client.getAsync('show'+id);
    if (cacheForshowPageExists) {
      res.send(cacheForshowPageExists);
    } else {
      next();
    }    
  });
  app.get("/show/:id", async(req, res) => {
      try{
        let id = req.params.id;
        const url = "http://api.tvmaze.com/shows";
        let newurl = url+"/"+id;
        let { data } = await axios.get(newurl);
        res.render(
          "shows/show",
          {
            title: "Show Data",
            showData: data,
          },
          async function (err, html) {
            let cacheForshowPageExists = await client.setAsync('show'+id, html);
            res.send(html);
            console.log("done cache for indiviual page");
          }
          
        );
  }
    catch(e){
      res.render('layouts/error', {title: 'Error', error: e.message });
    }
  });

  app.post("/search",async(req,res,next)=>{
    let searchItem  = req.body.search;

    //  client.zincrby("myzset1", 1, searchItem);
    let cacheForSearchPageExists = await client.getAsync('search'+searchItem);
    if (cacheForSearchPageExists) {
      client.zincrby("myzset1", 1, searchItem);
      
     client.zrevrange("myzset1", 0, 10, function (err, list) {
      if (err) throw err;
      console.log("plain range:", list);
  });

  client.zrevrange("myzset1", 0, 10, "withscores", function (err, listwithscores) {
    if (err) throw err;
    console.log("with scores:", listwithscores);
  })

      res.send(cacheForSearchPageExists);
    } else {
      next();
    }    
  })

  app.post("/search", async(req,res)=>{
    try{
      let z = new SortedSet();
      let searchItem  = req.body.search;
      const url = "http://api.tvmaze.com/search/shows";
      let newurl = url+"?q="+searchItem;
      let { data } = await axios.get(newurl);
  
  if(data.length <=0){
    res.render('layouts/error', { title: 'Error', error: 'No item found for this search' });
  }
  else{
    res.render("shows/searchPage",{title:'Search Data', searchData:data},
    async function (err, html) {
      let cacheForSearchPageExists = await client.setAsync('search'+searchItem, html);
      client.zadd("myzset1", 1, searchItem);
      res.send(html);
      console.log("done cache for indiviual page");
    });}
}
    catch(e){
      res.render('layouts/error', { title: 'Error',error: e.message });
    }
  })

  app.get("/popularsearches", async(req, res) => {
    try{
     await client.zrangebyscore("myzset1", 1, 10, function(err,list){
      if (err) throw err;
      list = list.reverse();
      res.render('shows/popularSearches',{ title: 'Popular Search List', popularSearch:list})
     });
}
  catch(e){
    res.render('layouts/error', { error: e.message });
  }
});

  app.use('*', (req, res) => {
    // res.sendStatus(404);
    res.render('layouts/error', { title: 'Error', error: 'Page Not Found.' });
  });

}