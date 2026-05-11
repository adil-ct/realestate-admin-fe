import React, { useState } from 'react';
import '../modal.css';
import './multiselct.css';
import { Modal, Spinner } from 'reactstrap';

const MultipleAddModal = ({
  isOpen,
  close,
  title,
  buttonText = 'Done',
  handleSubmit,
  loading,
}) => {
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const handleInput = e => {
    setValue(e.target.value.trim());
    setError('');
  };
  const checkEmail = val => val.match(/[\w\d\\.-]+@[\w\d\\.-]+\.[\w\d\\.-]+/g);
  const handleKeyPress = e => {
    const valuList = value.split(',').filter(item => checkEmail(item));
    if (e.key === 'Enter') {
      if (!checkEmail(value)) {
        setError('Please enter valid email');
        return;
      }
      // if (data.includes(value)) {
      //   setError('Email already added');
      //   return;
      // }
      setData(prev => [...new Set([...prev, ...valuList])]);
      setValue('');
    }
  };
  const handleRemove = val => {
    setData(prev => prev.filter(item => item !== val));
  };

  return (
    <>
      <div>
        <div>
          <Modal isOpen={isOpen} centered scrollable>
            <div className="modal-header justify-content-center flex-column">
              <div className="p-2">
                <div className="d-flex justify-content-center">
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
              <div className="w-100 position-relative">
                <input
                  type="text"
                  className="search-box1 w-100"
                  onChange={handleInput}
                  value={value}
                  placeholder="Type emails seprated by  ','  and press enter to add "
                  onKeyDown={handleKeyPress}
                />
                {error && <p className="color-red ml-1">{error}</p>}
              </div>
            </div>
            <div className="modal-body">
              {data.length ? (
                data?.map(item => (
                  <div key={item} className="emailbox">
                    <div>{item}</div>
                    <button
                      className="remove-button"
                      type="button"
                      onClick={() => handleRemove(item)}
                    >
                      remove
                    </button>
                  </div>
                ))
              ) : (
                <h5 className="text-center">No Users</h5>
              )}
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-primary waves-effect dropdownColor w-50"
                data-dismiss="modal"
                disabled={!data.length}
                onClick={() => handleSubmit(data)}
              >
                {loading ? <Spinner size="sm" /> : buttonText}
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default MultipleAddModal;
