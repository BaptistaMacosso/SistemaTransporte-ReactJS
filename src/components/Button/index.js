import React from 'react';
import Buttom from './styles';

const Button = ({text, onClick, type = 'button'}) => {
  return (
    <Buttom onClick={onClick} type={type}>
      {text}
    </Buttom>
  )
};

export default Button;