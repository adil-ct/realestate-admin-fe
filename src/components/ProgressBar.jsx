import React, { useEffect } from 'react';
import { Modal, Progress } from 'reactstrap';

const ProgressBar = ({ uploadPercentage, setUploading }) => {
  useEffect(() => {
    if (uploadPercentage === 100) {
      setTimeout(() => setUploading(0), 1000);
    }
  }, [uploadPercentage]);
  return (
    <div>
      <Modal isOpen={uploadPercentage} centered>
        <div className="modal-header">Uploading...</div>
        <div className="modal-body ">
          <Progress value={uploadPercentage} animated color="success" style={{ height: '20px' }} />
        </div>
        <div className="modal-footer  justify-content-center">{uploadPercentage}%</div>
      </Modal>
    </div>
  );
};

export default ProgressBar;
