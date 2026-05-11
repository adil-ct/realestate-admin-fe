import SweetAlert from 'react-bootstrap-sweetalert';

const DeleteModal = ({ close, text, title, confirm }) => (
  <SweetAlert
    title={title}
    warning
    showCancel
    confirmButtonText="Delete Admin"
    confirmBtnBsStyle="success"
    cancelBtnBsStyle="danger"
    onConfirm={confirm || close}
    onCancel={close}
  >
    {text}
  </SweetAlert>
);

export default DeleteModal;
