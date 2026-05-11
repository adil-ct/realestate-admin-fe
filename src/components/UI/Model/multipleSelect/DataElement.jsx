import React, { useState } from 'react';
import ButtonLoader from 'components/UI/Buttonloader/ButtonLoader';
import {axiosMain} from 'http/axios/axios_main';

const DataElement = ({
  users,
  handleChange,
  item,
  show,
  select,
  send,
    endPoint = '/admin/sendTempPassword',
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleClick = async val => {
    if (loading || success) return;
    try {
      setLoading(true);
        await axiosMain.post(endPoint, { id: val });
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <div key={item.name} className="emailbox">
      <div>{item[show || select]}</div>
      {send ? (
        <ButtonLoader
          text={success ? 'Sent' : 'Send'}
          loading={loading}
          success={success}
          onClick={() => handleClick(item[select])}
        />
      ) : (
        <input
          type="checkbox"
          className='circle_checkbox'
          onChange={e => handleChange(e, item)}
          checked={users.includes(item[select])}
        />
      )}
    </div>
  );
};

export default DataElement;
