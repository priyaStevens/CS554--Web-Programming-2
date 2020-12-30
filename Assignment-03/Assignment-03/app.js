const bluebird = require('bluebird');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const redis = require('redis');
const client = redis.createClient();
const axios = require('axios');
const configRoutes = require('./routes');

//https://medium.com/yld-blog/node-js-databases-using-redis-for-fun-and-profit-af61f9d0e49f

const static = express.static(__dirname + '/public');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on('connect', function(){
  console.log('Connected to Redis...');
});

// View Engine\
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/public', static);


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });