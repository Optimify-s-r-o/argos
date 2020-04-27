import CurrentWeek from './WeekSelector/CurrentWeek';
import Legend from './WeekSelector/Legend';
import React from 'react';
import Selector from './WeekSelector/Selector';
import styled from 'styled-components';
import { Row } from '../../../../../styles/global';

const WeekSelector = () => {
  return (
    <WeekSelectorEl>
      <CurrentWeek />
      <Selector />
      <Legend />
    </WeekSelectorEl>
  );
};

export default WeekSelector;

const WeekSelectorEl = styled(Row)`
  height: 60px;
  min-height: 60px;

  background-color: ${(props) => props.theme.colors.accent};

  > * {
    flex-grow: 1;
    flex-basis: 0;
  }
`;
