import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Switch from 'react-switch';
import { createProperty } from 'store/actions';
import './switch.css';

export const Offsymbol = () => <div className="uncheckedicon" />;

export const OnSymbol = () => <div className="checkedicon" />;

const SimpleToggleSwitch = ({ status, id, disabled , handleToggle }) => {
  const [data, setData] = useState(status);
  const dispatch = useDispatch();
  
  useEffect(() => {
    setData(status);
  }, [status]);

  const handleChange = async () => {
    if (handleToggle) {
      setData(!data);
      handleToggle();
    } else {
      setData(!data);
      dispatch(
        createProperty({
          status: 'OnSale',
          data: { otherInfo: { isHidden: data } },
          _id: id,
          onFail: () => setData(prev => !prev),
        }),
      );
    }
  };

  return (
    <>
      <Switch
        id={id}
        key={id}
        uncheckedIcon={<Offsymbol />}
        checkedIcon={<OnSymbol />}
        onColor="#00FF00"
        onChange={handleChange}
        disabled={disabled}
        checked={data}
      />
    </>
  );
};

export default SimpleToggleSwitch;
