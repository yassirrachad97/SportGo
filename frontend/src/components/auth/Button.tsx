import React, { FC } from 'react';

interface ButtonProps {
  text: string;
}

const Button: FC<ButtonProps> = ({ text }) => {
  return (
    <button className="submit" type="submit">
      {text}
    </button>
  );
};

export default Button;
