import { gql } from '@apollo/client';

const Add_NewPost = gql`
mutation uploadImagePost(
  $url: String!
  $description: String
  $posterName: String 
){
  uploadImage(url:$url, description: $description, posterName: $posterName){
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
`;

const Edit_Image = gql`
mutation updateImagePost(
  $id: ID!
  $url: String
  $posterName: String 
  $description: String
  $userPosted: Boolean
  $binned: Boolean

){
  updateImage(id: $id, url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned){
    id
    url
    description
    posterName
    binned
    userPosted
  }
}
`;

const DELETE_Image = gql`
  mutation deleteImageData($id: ID!) {
    deleteImage(id: $id) {
      id
      url
      description
      posterName
      binned
      userPosted
    }
  }
`;
// const GET_UnsplashData = gql`
// query unsplashImages(Int: 3){
//   	id
//     url
//     posterName
//     description
//     userPosted
//     binned
// }
// `;
// const GET_UnsplashData = gql`
// query getAllUnsplashedPost{
//   unsplashImages(pageNum:4){
//   	id
//     url
//     description
//     posterName
//     binned
//     userPosted
//   }
// }`;

const GET_UnsplashData = gql`
query getAllData($pageNum: Int){
  unsplashImages(pageNum: $pageNum){
  	id
    url
    posterName
    description
    userPosted
    binned
  }
}
`;

const GET_BinData = gql`
query getAllBinnedPost{
  binnedImages{
    id
    url
    description
    posterName
    binned
    userPosted
  }
}
`

export default {
  GET_UnsplashData,
  Get_MyPostData,
  Add_NewPost,
  DELETE_Image,
  Edit_Image,
  GET_BinData
 
};