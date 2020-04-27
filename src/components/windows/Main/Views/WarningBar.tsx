import React from 'react';
import styled from 'styled-components';
import { getColorWithOpacity } from '../../../../styles/theme';

interface WarningBarProps {
  visible: boolean;
  text: string;
  action?: React.ReactNode;
}

const WarningBar = (props: WarningBarProps) => {
  if (props.visible)
    return (
      <Bar className='warningBar'>
        {props.text}
        {props.hasOwnProperty('action') ? props.action : ''}
      </Bar>
    );
  else return null;
};

const Bar = styled.div`
  z-index: 999;

  padding: 8px 16px;

  background-color: ${(props) => props.theme.colors.warning};
  box-shadow: 0 10px 10px -10px ${(props) => getColorWithOpacity(props.theme.colors.black, 25)};
  color: black;
  font-size: 13px;
  font-weight: 400;

  * {
    display: inline-block;
  }

  a {
    text-decoration: underline;

    cursor: pointer;
  }
`;

export default WarningBar;
