import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import AddModal from './modals/AddModal';
import DeleteModal from './modals/DeleteModal'
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';
import NewPost from './newPost';
const isImageUrl = require('is-image-url');


function MyPost() {

    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteImage, setdeleteImage] = useState(null);
    
    const { loading, error, data  } = useQuery(queries.Get_MyPostData, {
      fetchPolicy: 'cache-and-network'
    });

    console.log(data);

 
  const [AddtoBin , {mutationloading, mutationerror}] = useMutation(queries.Edit_Image,{
    refetchQueries: [{ query: queries.Get_MyPostData}],
      awaitRefetchQueries: true,
  });
  
    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setShowAddModal(false);
      };

      const handleOpenAddModal = () => {
        setShowAddModal(true);
      };

      const handleOpenDeleteModal = (image) => {
        setShowDeleteModal(true);
        setdeleteImage(image);
        console.log(deleteImage);
      };

      if(data){
        const myPostImageData = data['userPostedImages'];
       return( 
        <div>
        <br />
          <div class = "col-12 col-xl-12 .col-lg-12 col-md-12">
          <Link to="/new-post" className="ml1 no-underline black">
          <button className="btn btn-danger">
            Upload Images
          </button>
            </Link>
          <br />
          <br />
          {myPostImageData && myPostImageData.map((myPostImage)=>{
            if(myPostImage != null){
            return(
              <div className="card" key={myPostImage!=null ? myPostImage.id : ''}>
              <div className="h5class card-header">
                    {myPostImage.description !=null ? myPostImage.description:''} by {myPostImage.posterName? myPostImage.posterName:''}
              </div>
              <div className="card-body">
                  
                    <br/>
                    <img src={myPostImage.url? myPostImage.url:''} width="600" height="auto" alt="mypost"/>
                  <br />
                  <br />

                  <form
                  className="form"
                  id="edit-myPost"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // alert(myPostImage.url);
                    AddtoBin({
                      variables: {
                        url: myPostImage.url,
                        description: myPostImage.description,
                        posterName: myPostImage.posterName,
                        id: myPostImage.id,
                        binned: true,
                        userPosted: myPostImage.userPosted
                      }
                    });
                  }
                }
                    >  
                    <br/>
                    <br/>  
                    <button className="button delete-button" type="submit">
                    {myPostImage.binned == false ? 'Add to bin' : 'Added to bin'}
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <button
                  className="button add-button" 
                  onClick={() => {
                    handleOpenDeleteModal(myPostImage);
                  }}
                  class="button add-button">
                  Delete
                </button>
                </form>

                </div>
                <br />
              </div>
            )}
          })  
    
          }  
          
          {/*Add Image Modal */}
        {showAddModal && showAddModal && (
          <AddModal
            isOpen={showAddModal}
            handleClose={handleCloseModals}
            modal="uploadImage"
          />
        )}
    {/*Delete Image Modal */}
    {showDeleteModal && showDeleteModal && (
      <DeleteModal
        isOpen={showDeleteModal}
        handleClose={handleCloseModals}
        deleteImage={deleteImage}
      />
    )}

    </div>
    </div> )
  } 
    else if (mutationloading || loading) {
      return <div className="h5class">Loading...</div>;
    } else if (mutationerror || error) {
      return <div className="h5class">{error.message}</div>;
    }
}


export default MyPost;