const {ApolloServer, gql} = require("apollo-server")
const loadash = require("lodash")
const uuid = require("uuid")
const axios = require("axios");
const fetch = require('node-fetch');
global.fetch = fetch;
const Unsplash = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;


const unsplash = new Unsplash({ accessKey: "xYDOYSnuXhYHkyd7ggszKkGwG82ED7SNCGpVoar6TGU" });

const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



const typeDefs = gql`
type ImagePost {
    id: ID
    url: String
    posterName: String
    description: String
    userPosted: Boolean
    binned: Boolean
},

type Query{
    unsplashImages(pageNum: Int) : [ImagePost]
    binnedImages : [ImagePost]
    userPostedImages : [ImagePost]
}

type Mutation{
    uploadImage(url: String!, description: String, posterName: String) : ImagePost
    updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean) : ImagePost
    deleteImage(id: ID!) : ImagePost
}
`;

let ImagePostArray = Array();
let page_num = 0;
const resolvers = {
    Query: {
            unsplashImages: async(_, args) => {
                console.log(args.pageNum);
                console.log(page_num)
            page_num = args.pageNum
            const url ='https://api.unsplash.com/photos?page='+args.pageNum+'&client_id=xYDOYSnuXhYHkyd7ggszKkGwG82ED7SNCGpVoar6TGU';

            // let ImagePostArray = Array();
            console.log(ImagePostArray);
            let getData = await client.getAsync("allUserImagePost");
            let imageArray = await axios.get(url);
            for(let image of imageArray.data){ 
                let binnedValue = false;
                if (getData){
                    userArray = JSON.parse(getData)
                    let binnedData = userArray.filter(function (item) {
                        if(item)
                            return item.id === image.id;
                    })[0];
                // console.log(binnedData)
                if (binnedData != undefined){
                    binnedValue = true
                    console.log('binned data');
                }
                else{
                    false
                }}
                
                            let img = {
                                
                                id: image.id,
                                url: image.urls.small, // raw | full | regular | small
                                posterName: image.user["name"],
                                description: image.description,
                                userPosted: false,
                                
                                binned: binnedValue,
                                
                            };
                            // console.log(`Imageoutput = ${JSON.stringify(img)}` ) 
                            let hasData = ImagePostArray.filter(function (item) {
                                if(item)
                                    return item.id === image.id;
                            })[0];
                            if(hasData == undefined){
                                ImagePostArray.push(img);
                            }

                        }

                        console.log(ImagePostArray.length);
                        return ImagePostArray;
                    
                },
        binnedImages: async () => {
            console.log('in bin');
            let allPostString  = await client.getAsync("allUserImagePost")
            if (allPostString){
                let binnedArray =  JSON.parse(allPostString)
                return binnedArray.filter(function (item) {
                    if(item)
                        return item.binned === true;
                });
            }

        },

        userPostedImages: async () => {
            console.log('hitting for all iser post');
            let allPostString  = await client.getAsync("allUserImagePost")
            if (allPostString){
                let binnedArray =  JSON.parse(allPostString)
                return binnedArray.filter(function (item) {
                    if(item)
                        return item.userPosted === true;
                });
            }
            // return JSON.parse(allPostString)
        }


    },

    Mutation:{
        uploadImage: async (_, args) => {
            console.log('hitting for upload image');
            let allPostString  = await client.getAsync("allUserImagePost") 
            let userArray = new Array()
            if (allPostString)
                userArray = JSON.parse(allPostString)
            
            console.log(args.url);
            let image = {
               id : uuid.v4(),
               url : args.url,
               description : args.description,
               posterName : args.posterName,
               userPosted : true,
               binned : false
            }
          
            userArray.push(image)
               
            client.setAsync("allUserImagePost", JSON.stringify(userArray))
            return image
        },

        updateImage: async (_, args) => {
            console.log('in update');
            console.log(args.url);
            console.log(args.id);

            let allPostString  = await client.getAsync("allUserImagePost") 
            let userArray = new Array()
            if(allPostString){
                userArray = JSON.parse(allPostString)
                console.log(userArray);
                let image = userArray.filter(function (item) {
                    if(item)
                        return item.id === args.id;
                })[0];

                // if (args.binned == false){
                if(image){
                    if(image.url !== args.url)
                    image.url = args.url
                    if(image.posterName !== args.posterName)
                    image.posterName = args.posterName
                    if(image.description !== args.description)
                    image.description = args.description
                    if(image.userPosted !== args.userPosted)
                    image.userPosted = args.userPosted

                    if(image.binned !== args.binned) 
                    image.binned = args.binned                       
                   
                }
                // loadash.remove(userArray , image)
                console.log(image);
                if(image){
                loadash.remove(userArray , image)
                console.log(await client.getAsync("allUserImagePost") );
                }
            }
            let newimage = {};
            console.log(args.binned)
            if(args.userPosted === true || args.binned == true){
            let newimage = {
                id: args.id,
                url : args.url,
                description : args.description,
                posterName : args.posterName,
                userPosted : args.userPosted,
                binned : args.binned
             }
            //  console.log(userArray)
            // userArray.push(newimage)
            console.log(newimage)
        
            userArray.push(newimage)
            }
            await client.setAsync("allUserImagePost", JSON.stringify(userArray));
            if(newimage){}       
                return newimage

    
        }, 

        deleteImage: async (_, args) => {
            let allPostString  = await client.getAsync("allUserImagePost") 
            let userArray = new Array()
            userArray = JSON.parse(allPostString)

            let image = userArray.filter(function (item) {
                if(item)
                    return item.id === args.id;
            })[0];

            loadash.remove(userArray , image)
            console.log(`after delete image : ${JSON.stringify(userArray)}`)
            await client.setAsync("allUserImagePost", JSON.stringify(userArray));
            return image
        } 
    }

};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});