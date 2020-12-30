import React, { useState } from 'react';
import { gql } from '@apollo/client';

import '../App.css';
import ReactModal from 'react-modal';
import { useQuery, useMutation } from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../../queries';

//For react-modal
ReactModal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    border: '1px solid #28547a',
    borderRadius: '4px'
  }
};

function AddModal(props) {

  const [showAddModal, setShowAddModal] = useState(props.isOpen);

  // const [uploadImage] = useMutation(queries.Add_NewPost, {
  //   update(cache, { data: { uploadImage } }) {
  //     const { imageData } = cache.readQuery({ query: queries.Get_MyPostData });
  //     cache.writeQuery({
  //       query: queries.GET_EMPLOYEES,
  //       data: { imageData: imageData.concat([uploadImage]) }
  //     });
  //   }
  // });

  const [uploadImage] = useMutation(queries.Add_NewPost,{
    refetchQueries: [{ query: queries.Get_MyPostData}],
      awaitRefetchQueries: true,
  });

 
  const handleCloseAddModal = () => {
    setShowAddModal(true);
    props.handleClose(false);
  };

  //creating body here
  let body = null;
  if (props.modal === 'uploadImage') {
    let url;
    let description;
    let posterName;

    body =(
      <form
      className="form"
      id="add-myPost"
      onSubmit={(e) => {
        e.preventDefault();
        uploadImage({
          variables: {
            url: url.value,
            description: description.value,
            posterName: posterName.value
          }
        });
        alert(url.value);
        url.value = '';
        description.value = '';
        posterName.value = '';
        setShowAddModal(false);
        
        props.handleClose();
      }
    }
        >

        <div className="form-group">
          <label>
            Url:
            <br />
            <input
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
            <input
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
            <input
              ref={(node) => {
                posterName = node;
              }}
              required
            />
          </label>
        </div>
        <br />
        <br />
        <button className="button add-button" type="submit">
          Upload Image
        </button>
      </form>
    )
  }

  return (
    <div>
      <ReactModal
        name="addModal"
        isOpen={showAddModal}
        contentLabel="Add Modal"
        style={customStyles}
      >
        {body}
        <button className="button cancel-button" onClick={handleCloseAddModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );

}



export default AddModal;