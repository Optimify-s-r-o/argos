import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

interface InputProps {
  hasError?: boolean;
}

const Input = (props: InputHTMLAttributes<HTMLInputElement> & InputProps) => {
  return <StyledInput {...props} />;
};

export default Input;

const StyledInput = styled.input`
  margin: 0.5rem 1rem;
  padding: 0.75rem 1.5rem;

  border: 0;
  border-radius: 999px;
  box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.25) ${(props) => (props.hasError ? ', inset 0 0 0 1px ' + props.theme.colors.danger : '')};
  font-family: 'Segoe UI';

  transition: box-shadow 0.2s ease-out;

  &:focus {
    box-shadow: 0 5px 25px -10px rgba(0, 0, 0, 0.5) ${(props) => (props.hasError ? ', inset 0 0 0 1px ' + props.theme.colors.danger : '')};

    outline: 0;
  }
`;
