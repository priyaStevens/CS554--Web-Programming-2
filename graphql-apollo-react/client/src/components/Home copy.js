import React, { useState } from 'react';
import './App.css';
import { useQuery } from '@apollo/client';
import queries from '../queries';

function UnSplashImageData(props) {
  let pageNumber = 1;
    const { loading, error, data } = useQuery(queries.GET_UnsplashData, {
        variables :{pageNum:pageNumber},
        fetchPolicy: 'cache-and-network'
      });

console.log(data);
console.log(data);

const handleMoreImages = () => {
  alert(pageNumber);
};

if(data){
    const unSplashImagesData = data['unsplashImages'];
    return (
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
            <div class="card-footer">
            <button type="button" class="btn btn-danger btn-lg">Add to bin </button>
            </div>
          </div>
        )
      })  

      }
        
          

      </div>
);
} else if (loading) {
  return <div>Loading</div>;
} else if (error) {
  return <div>{error.message}</div>;
}
}

      
    

export default UnSplashImageData;