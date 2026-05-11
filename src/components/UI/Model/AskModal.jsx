import React from 'react';
import './modal.css';
import { Form, Modal} from 'reactstrap';

const AskModal = ({ isOpen, close,title,text,subtext,onConfirm }) => {
  function togClose() {
    close(false);
  }

  return (
    <>
      <div>
        <div>
          <Modal
            isOpen={isOpen}
            centered
          >
            <div className="modal-header">
              <div className="d-flex justify-content-left">
                <h5 className="modal-title mt-0" id="myModalLabel" style={{ marginLeft: '10px' }}>
                  {title}
                </h5>
              </div>
              <button
                type="button"
                onClick={() => {
                  close(false);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form>
                <div className="row ">
                  <div className="d-flex  justify-content-between">
                   {text}
                  </div>
                  <div>
                    <p> {subtext}</p>
                  </div>
                </div>
              </Form>
            </div>
            <div className="modal-footer d-flex justify-content-right">
              <button
                type="button"
                onClick={() => {
                  togClose();
                }}
                className="btn btn-secondary waves-effect"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="btn btn-primary waves-effect dropdownColor"
                data-dismiss="modal"
              >
                Yes
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default AskModal;
