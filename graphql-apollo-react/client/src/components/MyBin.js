import React, { useState } from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';

function MyBinData(props) {
  // let pageNumber = 1;

  const[buttonText, setButtonText] = useState('Add to bin');
    const { loading, error, data } = useQuery(queries.GET_BinData, {
        fetchPolicy: 'cache-and-network'
      });

const [RemoveFromBin] = useMutation(queries.Edit_Image,{
  refetchQueries: [{ query: queries.GET_BinData}],
    awaitRefetchQueries: true,
});

if(data){
    const unSplashImagesData = data['binnedImages'];

    return (

      <div>  
        <br />
        <br />
      <div class = "col-12 col-xl-12 .col-lg-12 col-md-12">

      {unSplashImagesData && unSplashImagesData.map((unSplashImages)=>{
        if(unSplashImages != null){
        return(
          <div className="card" key={unSplashImages.id}>
          <div className="h5class card-header">
                {unSplashImages.description} by {unSplashImages.posterName}
          </div>
          <div className="card-body">
              
                <br/>
                <img src={unSplashImages.url} width="600" height="auto" alt="mybin"/>
              <br />
              <br />

              <form
              className="form"
              id="edit-myPost"
              onSubmit={(e) => {
                e.preventDefault();
                RemoveFromBin({
                  variables: {
                    url: unSplashImages.url,
                    description: unSplashImages.description,
                    posterName: unSplashImages.posterName,
                    id: unSplashImages.id,
                    binned: false,
                    userPosted: unSplashImages.userPosted
                  }
                });
                alert('removed from bin');
              }
            }
                >  
                <br/>
                <br/>  
                <button className="button add-button" type="submit">
                Remove from bin
              </button>
            </form>
            </div>
          </div>
        )}
      })  

      }
        
          

      </div>
      </div>
);
} 
else if (loading) {
  return <div className="h5class">Loading...</div>;
} else if (error) {
  return <div className="h5class">{error.message}</div>;
}
}

      
    

export default MyBinData;