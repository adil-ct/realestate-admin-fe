import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import './modal.css';

const DeleteGenericModal = ({ isOpen, onClose, title, confirm, header }) => {
  const toggle = () => {
    onClose(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader className="mx-auto" toggle={toggle}>
          {header || "Delete Entry"}
        </ModalHeader>
        <ModalBody>
          <div>{title || 'Do you still want to delete this entry?'}</div>
        </ModalBody>
        <ModalFooter>
          <div className="delete-button-card">
            <Button color="secondary w-100 mx-4" onClick={toggle}>
              Cancel
            </Button>
            <Button color="primary w-100" onClick={confirm}>
              Confirm
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteGenericModal;
