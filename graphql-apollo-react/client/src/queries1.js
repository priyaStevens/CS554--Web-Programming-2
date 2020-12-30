import { gql } from '@apollo/client';

const GET_UnsplashData = gql`

query getAllData($pageNum: int){
  unsplashImages(pageNum: $pageNum){
  	id
    url
    description
    posterName
    binned
    userPosted
  }
}
`;

const Get_MyPostData = gql`
query {
  userPostedImages{
    id
    url
    description
    posterName
    binned
    userPosted
  }
}
`

// const Add_NewPost = gql`
//   mutation addNewPost(
//     $url: String!
//     $description: String!
//     $posterName: Int!
//   ){
//   uploadImage(
//       url: $url
//       description: $description
//       posterName: $posterName) {
//         id
//         url
//         description
//         posterName
//         binned
//         userPosted

    
//   }
// }
// `;
const Add_NewPost = gql`
mutation
 {
  uploadImage(url:"vbv"
   description:"thi900"
    posterName:"thisss900"){
    id
    url
    description
    posterName
    binned
    userPosted
  } 
}`;

export default {
  GET_UnsplashData,
  Get_MyPostData,
  Add_NewPost
 
};
