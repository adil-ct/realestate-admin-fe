import React, { useState } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useSelector } from 'react-redux';
import { Input, Label, Spinner } from 'reactstrap';

const AttomIdModal = ({ close, confirm }) => {
  const [value, setValue] = useState('');
  const { createLoading } = useSelector(state => state.property);
  const handleChange = e => {
    setValue(e.target.value.trim());
  };
  // const handleConfirm = () => {
  //   history.push('/edit-property');
  // };
  return (
    <div>
      <SweetAlert
        title="Add Property"
        showCancel
        showConfirm
        show
        cancelBtnBsStyle="danger"
        confirmBtnText={createLoading ? <Spinner size="sm" /> : 'Submit'}
        style={{ padding: '2em 3em 3em 3em', borderRadius: '10px' }}
        cancelBtnStyle={{ marginTop: '10px', width: '30%' }}
        confirmBtnStyle={{ marginTop: '10px', width: '30%' }}
        onConfirm={() => confirm(value)}
        onCancel={close}
      >
        <Label htmlFor="attom-input" className="mt-3">
          Enter the property id from ATTOM
        </Label>
        <Input type="text" onChange={handleChange} value={value} id="attom-input" className="p-2" />
      </SweetAlert>
    </div>
  );
};

export default AttomIdModal;
