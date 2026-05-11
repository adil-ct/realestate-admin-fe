import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import React, { useState } from 'react';

const ButtonDropDown = ({ title, options, onClick, name, noAll ,className,staticTitle=false}) => {
  const [mainValue, setMainValue] = useState(title);
  const [open, setOpen] = useState(false);

  const handleChange = (e,show) => {
    if (!onClick || mainValue === e) return;
    if(!staticTitle){
      setMainValue(show || e || title);
    }
    onClick(e, name);
  };

  return (
    <div className={className || ""}>
      <Dropdown toggle={() => setOpen(e => !e)} isOpen={open}>
        <DropdownToggle caret color="primary" className="dropdownColor">
          {mainValue}
          <i className="mdi mdi-chevron-down ml-2" />
        </DropdownToggle>
        <DropdownMenu>
          {!options.length ? (
            <DropdownItem>No data</DropdownItem>
          ) : !noAll ? (
            <DropdownItem value="" onClick={() => handleChange('', '')}>
              All
            </DropdownItem>
          ) : null}
          {options.map(item => {
            if (typeof item === 'object') {
              return (
                <DropdownItem
                  key={Object.keys(item)[0]}
                  value={Object.values(item)[0]}
                  onClick={e => handleChange(e.target.value, Object.keys(item)[0])}
                  // active={item === title}
                >
                  {Object.keys(item)[0]}
                </DropdownItem>
              );
            }
            return (
              <DropdownItem
                key={item}
                value={item}
                onClick={e => handleChange(e.target.value)}
                active={item === mainValue}
              >
                {item}
                {/* {item[0].toUpperCase() + item?.slice(1,item?.length)} */}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
export default ButtonDropDown;
