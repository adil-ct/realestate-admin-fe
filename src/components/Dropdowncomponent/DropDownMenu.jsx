import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, Select } from '@mui/material';

const DropDownMenu = ({ options, setFieldValue, className, disabled, selectedValues, errors }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedValue(selectedId);
    setFieldValue("propertyId",selectedId);
  };
 
  useEffect(() => {   
    if (selectedValues) {
      setSelectedValue(selectedValues);
    }
  }, [selectedValues]);

  return (
    <FormControl fullWidth>
      <Select
        labelId="dropdown-label"
        id="dropdown"
        value={selectedValue}
        onChange={handleSelectChange}
        className={className}
        disabled={disabled}
      >
        {options?.map((property) => (
          <MenuItem key={property?._id} value={property?._id}>
            {property?.title}
          </MenuItem>
        ))}
      </Select>
      {errors && (
         <div className="text-danger">{errors}</div>
        )}
    </FormControl>
  );
};

export default DropDownMenu;
