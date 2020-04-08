import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Button = styled.button`
  height: 32px;

  padding: 0 16px;

  background: transparent;
  border: 2px solid #046;
  border-radius: 16px;
  color: #046;

  transition: all 0.2s ease-out;

  &[disabled] {
    opacity: 0.5;
  }

  &:hover {
    background: #004466;
    color: #00bbff;

    cursor: pointer;

    box-shadow: 0px 0px 10px 0px rgba(0, 68, 102, 0.5);
  }

  &[disabled]:hover {
    background: transparent;
    box-shadow: none;
    color: #004466;
    cursor: default;
  }

  &:active {
    background: #006699;
    border-color: #006699;
    color: #00bbff;

    box-shadow: 0px 0px 15px 0px rgba(0, 68, 102, 0.75);
  }

  &:focus {
    outline: 0;

    box-shadow: 0px 0px 10px 0px rgba(0, 68, 102, 0.5);
  }
`;

export const TextButton = styled(Button)`
  padding: 0 16px;
`;

export const CharButton = styled(Button)`
  width: 32px;
`;
