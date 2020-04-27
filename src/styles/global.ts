import styled from 'styled-components';
import { getColorWithOpacity, getMultipliedColor } from './theme';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Button = styled.button`
  height: 32px;

  background: transparent;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 16px;
  color: ${(props) => props.theme.colors.primary};

  transition: all 0.2s ease-out;

  &[disabled] {
    opacity: 0.5;
  }

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.accent};

    cursor: pointer;

    box-shadow: 0px 0px 10px 0px
      ${(props) => getColorWithOpacity(props.theme.colors.primary, 50)};
  }

  &[disabled]:hover {
    background: transparent;
    box-shadow: none;
    color: ${(props) => props.theme.colors.primary};
    cursor: default;
  }

  &:active {
    background: ${(props) =>
      getMultipliedColor(props.theme.colors.primary, 1.5)};
    border-color: ${(props) =>
      getMultipliedColor(props.theme.colors.primary, 1.5)};
    color: ${(props) => props.theme.colors.accent};

    box-shadow: 0px 0px 15px 0px
      ${(props) => getColorWithOpacity(props.theme.colors.primary, 75)};
  }

  &:focus {
    outline: 0;

    box-shadow: 0px 0px 10px 0px
      ${(props) => getColorWithOpacity(props.theme.colors.primary, 50)};
  }
`;

export const TextButton = styled(Button)`
  padding: 0 16px;
`;

export const CharButton = styled(Button)`
  width: 32px;
`;

export const CalendarRowHeader = styled.div`
  position: relative;

  width: 200px;

  padding: 8px 16px;

  &:after {
    content: '';

    position: absolute;

    right: 0;
    bottom: 0;
    left: 0;

    height: 1px;

    background: ${(props) => getColorWithOpacity(props.theme.colors.black, 0)};
    background: -moz-linear-gradient(
      left,
      ${(props) => getColorWithOpacity(props.theme.colors.black, 0)} 0%,
      ${(props) => getColorWithOpacity(props.theme.colors.black, 10)} 100%
    );
    background: -webkit-gradient(
      left top,
      right top,
      color-stop(
        0%,
        ${(props) => getColorWithOpacity(props.theme.colors.black, 0)}
      ),
      color-stop(
        100%,
        ${(props) => getColorWithOpacity(props.theme.colors.black, 10)}
      )
    );
    background: -webkit-linear-gradient(
      left,
      ${(props) => getColorWithOpacity(props.theme.colors.black, 0)} 0%,
      ${(props) => getColorWithOpacity(props.theme.colors.black, 10)} 100%
    );
    background: -o-linear-gradient(
      left,
      ${(props) => getColorWithOpacity(props.theme.colors.black, 0)} 0%,
      ${(props) => getColorWithOpacity(props.theme.colors.black, 10)} 100%
    );
    background: -ms-linear-gradient(
      left,
      ${(props) => getColorWithOpacity(props.theme.colors.black, 0)} 0%,
      ${(props) => getColorWithOpacity(props.theme.colors.black, 10)} 100%
    );
    background: linear-gradient(
      to right,
      ${(props) => getColorWithOpacity(props.theme.colors.black, 0)} 0%,
      ${(props) => getColorWithOpacity(props.theme.colors.black, 10)} 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#000000', GradientType=1 );
  }
`;

export const CalendarRow = styled(Row)`
  margin-right: 17px; /* scroll bar for jobs */
`;

export const CalendarDays = styled.div`
  display: flex;

  flex-grow: 1;
`;

export const CalendarDay = styled.div`
  display: flex;

  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;

  border-bottom: 1px solid
    ${(props) => getColorWithOpacity(props.theme.colors.black, 10)};

  border-left: ${(props) =>
    props.isWeekStart ? '1px solid ' + props.theme.colors.primary : 'none'};

  color: ${(props) =>
    props.isNonWorkDay ? props.theme.colors.danger : 'inherit'};
  background-color: ${(props) =>
    props.isNonWorkDay
      ? getColorWithOpacity(props.theme.colors.primary, 5)
      : 'transparent'};
`;
