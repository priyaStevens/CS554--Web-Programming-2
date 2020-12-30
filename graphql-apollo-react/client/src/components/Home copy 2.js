import React, { useState } from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';

function UnSplashImageData(props) {
  // let pageNumber = 1;
  const[pageNumber, setPageNumber] = useState(1);
    const { loading, error, data } = useQuery(queries.GET_UnsplashData, {
        variables :{pageNum:pageNumber},
        fetchPolicy: 'cache-and-network'
      });

console.log(data);
console.log(data);

const handleMoreImages = () => {
 setPageNumber(pageNumber+1);
};

// const [AddtoBin] = useMutation(queries.Add_NewPost);

// const addImageToBin = (imageData) => {
//   const {loading, error, editImage} = useMutation(queries.Edit_Image,{
//     variables : {id:imageData.id, url: imageData.url, posterName:imageData.posterName, description: imageData.description, userPosted: imageData.userPosted, binned: imageData.binned},
//     fetchPolicy: 'cache-and-network'
//   });
//   console.log(editImage);
// };



if(data){
    const unSplashImagesData = data['unsplashImages'];

    return (

      <div>
        <button className="button" onClick={handleMoreImages}>
          Load More Images
        </button>
        
        <br />
        <br />
      <div class = "col-12 col-xl-12 .col-lg-12 col-md-12">
      {unSplashImagesData.map((unSplashImages)=>{
        return(
          <div className="card" key={unSplashImages.id}>
          <h5 className="card-header">
                {unSplashImages.description} by {unSplashImages.posterName}
          </h5>
          <div className="card-body">
              
                <br/>
                <img src={unSplashImages.url} width="600" height="auto" />
              <br />
              <br />
            </div>
            <form
            className="form"
            id="edit-myPost"
          //   onSubmit={(e) => {
          //     e.preventDefault();
          //     AddtoBin({
          //       variables: {
          //         url: unSplashImages.url,
          //         description: unSplashImages.description,
          //         posterName: unSplashImages.posterName,
          //         id: unSplashImages.id,
          //         binned: unSplashImages.binned,
          //         userPosted: false
          //       }
          //     });
              
          //     props.handleClose();
          //   }
          // }
              >    
            <div class="card-footer">
            <button type="button" class="btn btn-danger btn-lg" type="submit" >Add to bin </button>
            </div>
            </form>
          </div>
        )
      })  

      }
        
          

      </div>
      </div>
);
} else if (loading) {
  return <div>Loading</div>;
} else if (error) {
  return <div>{error.message}</div>;
}
}

      
    

export default UnSplashImageData;