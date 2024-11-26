import React, { FC, ReactNode } from "react";
import InputField from "./InputField";
import Button from "./Button";

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  errorMessage?: string;
  submitText?: string;
}

interface FormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputs: InputFieldProps[];
  title: string;
  children?: ReactNode;
}

const Form: FC<FormProps> = ({ onSubmit, inputs, title, children }) => {
  return (
    <form onSubmit={onSubmit}>
      <h1>{title}</h1>
      {inputs.map((input, index) => (
        <InputField
          key={index}
          type={input.type}
          placeholder={input.placeholder}
          value={input.value}
          onChange={input.onChange}
          icon={input.icon}
          errorMessage={input.errorMessage}
        />
      ))}
      {children}
      <Button text={inputs.find(input => input.submitText)?.submitText || "Envoyer"} />
    </form>
  );
};

export default Form;
