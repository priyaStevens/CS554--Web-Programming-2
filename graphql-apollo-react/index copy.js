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


const resolvers = {
    Query: {
        

        
           unsplashImages: async(_, args) => {
            const url ='https://api.unsplash.com/photos??page=1&per_page=10&client_id=xYDOYSnuXhYHkyd7ggszKkGwG82ED7SNCGpVoar6TGU&limit=100';

            let ImagePostArray = Array();

            let imageArray = await axios.get(url);
            for(let image of imageArray.data){

                            let img = {
                                id: image.id,
                                url: image.urls.small, // raw | full | regular | small
                                posterName: image.user["name"],
                                description: image.description,
                                userPosted: false,
                                binned: false,
                            };
                            // console.log(`Imageoutput = ${JSON.stringify(img)}` ) 
                            ImagePostArray.push(img);
                            // console.log(`output = ${JSON.stringify(ImagePostArray)}` ) 
                        }
    
                        console.log(`output = ${JSON.stringify(ImagePostArray)}` ) 
                        return ImagePostArray;
                    
                }
,
       
        binnedImages: async () => {
            let allPostString  = await client.getAsync("allUserImagePost")
            let binnedArray =  JSON.parse(allPostString)
            return binnedArray.filter(function (item) {
                if(item)
                    return item.binned === true;
            });           
        },

        userPostedImages: async () => {
            let allPostString  = await client.getAsync("allUserImagePost")
            return JSON.parse(allPostString)
        }


    },

    Mutation:{
        uploadImage: async (_, args) => {

            let allPostString  = await client.getAsync("allUserImagePost") 
            let userArray = new Array()
            if (allPostString)
                userArray = JSON.parse(allPostString)
            
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
            
            let allPostString  = await client.getAsync("allUserImagePost") 
            let userArray = new Array()
            userArray = JSON.parse(allPostString)

            let image = userArray.filter(function (item) {
                if(item)
                    return item.id === args.id;
            })[0];

            
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
            loadash.remove(userArray , image)
            userArray.push(image)
            await client.setAsync("allUserImagePost", JSON.stringify(userArray));
            return image
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