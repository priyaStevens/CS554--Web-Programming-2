import React, { useState } from 'react';
import '../App.css';
import { useMutation } from '@apollo/client';
import ReactModal from 'react-modal';

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

/* The React Apollo package grants access to a Query component, which takes a query as prop and executes it when its rendered. 
That’s the important part: it executes the query when it is rendered. 
It uses React’s render props pattern, using a child as a function implementation where you can access the result of the query as an argument.
*/
function DeleteModal(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
  const [deleteImage, setdeleteImage] = useState(props.deleteImage);

  const [removeImage] = useMutation(queries.DELETE_Image,{
    refetchQueries: [{ query: queries.Get_MyPostData}],
      awaitRefetchQueries: true,
  });

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setdeleteImage(null);
    props.handleClose();
  };

  return (
    <div>
    {/*Delete Employee Modal */}
    <ReactModal
    name="deleteModal"
    isOpen={showDeleteModal}
    contentLabel="Delete Image"
    style={customStyles}
  >
  <div>
  <p>
    Are you sure you want to delete {deleteImage.description}{' '}
    {deleteImage.posterName}?
  </p>

  <form
            className="form"
            id="delete-Image"
            onSubmit={(e) => {
              e.preventDefault();
              removeImage({
                variables: {
                  id: deleteImage.id
                }
              });
              setShowDeleteModal(false);

              // alert('Image Deleted');
              props.handleClose();
            }}
            
          ><br />
          <br />
          <button className="button add-button" type="submit">
            Delete Image
          </button></form>
          </div>

        <br />
        <br />
        <button
          className="button cancel-button"
          onClick={handleCloseDeleteModal}
        >
          Cancel
        </button>
      </ReactModal>
    </div>
  )
}

export default DeleteModal;
