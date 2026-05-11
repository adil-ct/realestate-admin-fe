import {React, useEffect, useState} from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      marginTop:15
    },
  },
};

export default function MultiSelectDropdown({ placeholder, options, selectedValues, setFieldValue, errors , fieldName, disabled}) {
  const theme = useTheme();
  
  

  const [selectedValue, setSelectedValue] = useState([]);
  const [properties, setProperties] = useState([]);

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedValue(selectedId);
    const lastSelected = selectedId[selectedId.length - 1];
    
    if (lastSelected === '*') {
      setFieldValue(fieldName, ['*']);
    } else {
      const filteredValues = selectedId.filter((value) => value !== '*');
      setFieldValue(fieldName, filteredValues);
    }
  };
 
  useEffect(() => {   
    if (selectedValues) {
      setSelectedValue(selectedValues);
    }
  }, [selectedValues]);
 
  useEffect(() =>{
    if(options?.length) setProperties([  ...options])
  },[options])

  return (
    <div className='mt-1'>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id="demo-multiple-name-label">{placeholder}</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={selectedValue}
          onChange={handleSelectChange}
          input={<OutlinedInput label={placeholder} />}
          disabled={disabled}
          MenuProps={MenuProps}
        >
          {properties?.map(property => (
            <MenuItem key={property?._id} value={property?._id} style={getStyles(property, selectedValues, theme)}>
              {property?.title}
            </MenuItem>
          ))}
        </Select>
        {errors && (
         <div className="text-danger">{errors}</div>
        )}
      </FormControl>
    </div>
  );
}
