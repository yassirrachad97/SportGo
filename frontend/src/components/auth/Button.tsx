import React, { FC } from 'react';

interface ButtonProps {
  text: string;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ text, disabled = false }) => {
  return (
    <button className="submit" type="submit" disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
