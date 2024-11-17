import React from 'react';
import Inputs from './styles';

const Input = ({type, placeholder, value, onChange}) => {
  return (
    <Inputs 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
    />
  )
}

export default Input;