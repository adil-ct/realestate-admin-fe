/* eslint-disable no-underscore-dangle */
import React from 'react';
import "./index.css";

const CustomModel = ({ onClose, onSubmit, data, isLoading }) => {

    const toggle = () => {
        onClose({show: false});
    };
  
  return (  
    <>
      <div className="backdrop" />
      <div className="c_model">
        <div className="c_header">
            {data?.heading}
            <span onClick={toggle} className="cross" />
        </div>
        <div className="c_body">
            {data?.titleHtml ? <span dangerouslySetInnerHTML={{__html: data?.title}} /> : data?.title}
        </div>
        <div className="c_footer">
            <button type="button" disabled={isLoading} className="c_btn confirm" onClick={() => onSubmit(data)}>Confirm</button>
            <button type="button" disabled={isLoading} className="c_btn cancel" onClick={toggle}>Cancel</button>
        </div>
      </div>
    </>
  )
}

export default CustomModel