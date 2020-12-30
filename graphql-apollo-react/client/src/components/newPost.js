import React, { useState } from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';


const isImageUrl = require('is-image-url');


function NewPost(props) {

    // const [loading,uploadImage, error] = useMutation(queries.Add_NewPost);
    
    const [uploadImage , {loading, error} ] = useMutation(queries.Add_NewPost,{
      refetchQueries: [{ query: queries.Get_MyPostData}],
        awaitRefetchQueries: true,
    });


  //creating body here  
    let url;
    let description;
    let posterName;


    if(loading){
      return(<div>
      Loading
      </div>
      )
    }
    else if(error){
      return(
      <div>
       {error.message}
      </div>
      )
  
    }

  else return (
    <div class = 'addPost'>

    <form
    className="form"
    id="add-myPost"
    onSubmit={(e) => {
      e.preventDefault();

      if(isImageUrl(url.value)) {
      uploadImage({
        variables: {
          url: url.value,
          description: description.value,
          posterName: posterName.value
        }
      });
      alert('New Post added');
      url.value = '';
      description.value = '';
      posterName.value = '';

    }else{
      alert('Please enter valid Image url');
    }
  }
  }
      >

      <div className="form-group">
        <label>
          Url:
          <br />
          <input class="form-control"
            ref={(node) => {
              url = node;
            }}
            required
            autoFocus={true}
          />
        </label>
      </div>
      <br />
      <div className="form-group">
        <label>
          Description:
          <br />
          <input class="form-control"
            ref={(node) => {
              description = node;
            }}
            required
          />
        </label>
      </div>
      <br />
      <div className="form-group">
        <label>
          Poster Name:
          <br />
          <input class="form-control"
            ref={(node) => {
              posterName = node;
            }}
            required
          />
        </label>
      </div>
      <button className="button add-submitbutton" type="submit" >
        Upload Image
      </button>
    </form>
    </div>
    
  );

  

  }
  


export default NewPost;