import ReactSelect from 'react-select';
import React from 'react';

const Select = (props) => {
  return (
    <ReactSelect
      className='react-select-container'
      classNamePrefix='react-select'
      placeholder=''
      {...props}
    />
  );
};

export default Select;
