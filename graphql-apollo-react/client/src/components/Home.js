import React, { useState } from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';
import { ValuesOfCorrectTypeRule } from 'graphql';

function UnSplashImageData(props) {
  // let pageNumber = 1;
  const[pageNumber, setPageNumber] = useState(1);
    const { loading, error, data } = useQuery(queries.GET_UnsplashData, {
        variables :{pageNum:pageNumber},
        fetchPolicy: 'cache-and-network'
      });
console.log(data);

      const [AddtoBin, {mutationLoading, mutationError}] = useMutation(queries.Edit_Image,{
        refetchQueries: [{ query: queries.GET_BinData}],
          awaitRefetchQueries: true,
      });

const handleMoreImages = () => {
 setPageNumber(pageNumber+1);
};

if(data){
    const unSplashImagesData = data['unsplashImages'];

    return (

      <div>  
        <br />
      <div class = "col-12 col-xl-12 .col-lg-12 col-md-12">

      <button className="btn btn-danger" onClick={handleMoreImages}>
      Load More Images
    </button>
    <br />
      {unSplashImagesData.map((unSplashImages)=>{
        return(
          <div className="card" key={unSplashImages.id}>
          <div className="h5class card-header">
                {unSplashImages.description} by {unSplashImages.posterName}
          </div>
          <div className="card-body">
              
                <br/>
                <img src={unSplashImages.url} width="600" height="auto" alt ="unsplashImage" />
              <br />
              <br />

              <form
              className="form"
              id="edit-myPost"
              onSubmit={(e) => {
                e.preventDefault();
                AddtoBin({
                  variables: {
                    url: unSplashImages.url,
                    description: unSplashImages.description,
                    posterName: unSplashImages.posterName,
                    id: unSplashImages.id,
                    binned: true,
                    userPosted: unSplashImages.userPosted
                  }
                });
                alert('added to bin');
              }
            }
                >  
                <br/>
                <br/>  
                <button className="button add-button" type="submit">
                {unSplashImages.binned == false ? 'Add to bin' : 'Added to bin'}
              </button>
            </form>
            </div>
          </div>
        )
      })  

      }
        
          

      </div>
      </div>
);
} else if (mutationLoading || loading) {
  return <div className="h5class">Loading...</div>;
} else if (mutationError || error) {
  return <div className="h5class">{error.message}</div>;
}
}

      
    

export default UnSplashImageData;