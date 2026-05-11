import AskModal from 'components/UI/Model/AskModal';
import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import './switch.css';

export const Offsymbol = () => <div className="uncheckedicon" />;

export const OnSymbol = () => <div className="checkedicon" />;

const ToggleSwitch = ({ status, id, onChange, title, text, subtext }) => {
  const [data, setData] = useState(status);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setData(status);
  }, [status]);
  const handleChange = async () => {
    if (data) {
      setOpen(true);
    } else {
      if (onChange) {
        try {
          await onChange();
          setData(!data);
        } catch (err) {
          console.log(err);
        }
        return;
      }
      setData(!data);
    }
  };
  const onConfirm = async () => {
    try {
      if (onChange) await onChange();
      setOpen(false);
      setData(false);
    } catch (err) {
      setOpen(false);
    }
  };
  return (
    <>
      <AskModal
        isOpen={open}
        close={setOpen}
        title={title || 'Admin Status'}
        text={
          text ||
          'If you deactivate admin, he will loose all admin access, till set to active again.'
        }
        subtext={subtext || 'Are you sure you want to disable the admin?'}
        onConfirm={onConfirm}
      />
      <Switch
        id={id}
        uncheckedIcon={<Offsymbol />}
        checkedIcon={<OnSymbol />}
        onColor="#00FF00"
        onChange={handleChange}
        checked={data}
      />
    </>
  );
};

export default ToggleSwitch;
