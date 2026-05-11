import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteCard } from 'store/actions';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import './modal.css';

const DeleteCard = ({ isOpen, onClose, id, medium }) => {
  const toggle = () => {
    onClose(false);
  };
  const dispatch = useDispatch();
  const requestBody = {
    id,
  };
  const confirmDelete = () => {
    dispatch(deleteCard(requestBody));
    onClose(false);
  };
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader className="mx-auto" toggle={toggle}>
          Delete {medium !== 'card' ? 'Account' : 'Card'}
        </ModalHeader>
        <ModalBody>
          <div>Do you still want to delete your {medium !== 'card' ? 'account' : 'card'}?</div>
        </ModalBody>
        <ModalFooter>
          <div className="delete-button-card">
            <Button color="secondary w-100 mx-4" onClick={toggle}>
              Cancel
            </Button>
            <Button color="primary w-100" onClick={confirmDelete}>
              Sure
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteCard;
