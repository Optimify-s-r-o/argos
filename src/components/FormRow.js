import React from 'react';
import styled from 'styled-components';

function FormRow(props) {
  let selectable = false;
  if (props.hasOwnProperty('selectable') && props.selectable === true)
    selectable = true;

  let showBorder = true;
  if (props.hasOwnProperty('border') && props.border === false)
    showBorder = false;

  return (
    <FormCardRow className={showBorder ? '' : 'no-border'}>
      <FormCardRowHeader className='form-card-row-header'>
        {props.title}
      </FormCardRowHeader>
      <FormCardRowContent className='form-card-row-content'>
        {selectable ? (
          <Selectable className='selectable'>{props.children}</Selectable>
        ) : (
          props.children
        )}
      </FormCardRowContent>
    </FormCardRow>
  );
}

export default FormRow;

export const FormCardRowHeader = styled.div`
  display: table-cell;

  width: 200px;

  padding: 16px 0 16px 24px;

  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 68, 102, 0.65);
  font-weight: 400;
`;

export const FormCardRowContent = styled.div`
  display: table-cell;

  width: 269px;

  padding: 16px 0 16px 24px;

  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #004466;
  font-weight: 400;

  input[type='text'],
  input[type='date'],
  input[type='number'] {
    width: 100%;

    margin: -8px -16px;
    padding: 8px 16px;

    background: rgba(0, 68, 102, 0.05);
    border: 1px solid transparent;
    color: #004466;
    font-family: 'Segoe UI';

    transition: border 0.2s ease-in-out;
  }

  input[type='text']:focus,
  input[type='date']:focus,
  input[type='number']:focus {
    border: 1px solid rgba(0, 68, 102, 0.2);
    outline: 0;
  }

  .react-select-container {
    width: 100%;

    margin: -8px -16px;
  }

  .react-select__control {
    background: rgba(0, 68, 102, 0.05) !important;
    border: 1px solid transparent !important;
    border-radius: 0 !important;
  }

  .react-select__control--is-focused {
    border: 1px solid rgba(0, 68, 102, 0.2) !important;
    box-shadow: none !important;
    outline: 0 !important;
  }

  .react-select__single-value {
    color: #004466 !important;
  }

  .react-select__menu {
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
  }

  .react-select__option--is-focused {
    background-color: rgba(0, 68, 102, 0.1) !important;
  }

  .react-select__option--is-selected {
    background-color: #00bbff !important;
  }

  .react-select__input > input {
    margin: 0;
  }

  /** CALENDAR */

  .react-calendar {
    width: 245px !important;

    border: 0 !important;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    font-family: 'Segoe UI' !important;
  }

  .react-calendar > button {
    font-family: 'Segoe UI' !important;
  }

  .react-date-picker__calendar,
  .react-daterange-picker__calendar {
    width: 245px !important;
  }

  .react-calendar__navigation {
    height: 32px !important;

    margin: 0 0 8px !important;
  }

  .react-calendar__navigation button {
    min-width: 32px !important;

    color: #00bbff !important;
    font-family: 'Segoe UI' !important;
  }

  .react-calendar__navigation button:hover {
    background-color: rgba(0, 68, 102, 0.05) !important;
  }

  button.react-calendar__navigation__label {
    color: #004466 !important;
  }

  .react-calendar__month-view__weekdays {
    margin: 0 0 8px;

    font-weight: 300 !important;
    font-family: 'Segoe UI' !important;
    text-transform: lowercase !important;
  }

  .react-calendar__month-view__weekdays abbr[title] {
    text-decoration: none;
  }

  .react-calendar__tile {
    padding: 0.675em 0.5em !important;
    color: #004466;
    font-weight: 300 !important;
    font-family: 'Segoe UI' !important;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: rgba(0, 68, 102, 0.25) !important;
  }

  .react-calendar__month-view__days__day--weekend {
    color: #ff4040 !important;
  }

  .react-calendar__tile--active.react-calendar__month-view__days__day--weekend {
    color: #ffdddd !important;
  }

  .react-calendar__tile--active {
    background: #00bbff !important;
  }

  .react-calendar__tile:enabled:hover:not(.react-calendar__tile--active),
  .react-calendar__tile:enabled:focus:not(.react-calendar__tile--active),
  .react-calendar--selectRange
    .react-calendar__tile--hover:not(.react-calendar__tile--active) {
    background-color: rgba(0, 68, 102, 0.05) !important;
  }

  .react-calendar__tile:enabled:hover.react-calendar__tile--active,
  .react-calendar__tile:enabled:focus.react-calendar__tile--active,
  .react-calendar--selectRange
    .react-calendar__tile--hover.react-calendar__tile--active {
    background-color: #00a8eb !important;
  }

  .react-calendar__decade-view__years__year,
  .react-calendar__year-view__months__month {
    border-radius: 22px !important;
  }

  .react-calendar__tile--now {
    text-decoration: underline;
  }

  .react-calendar__tile--rangeStart {
    border-bottom-left-radius: 50%;
    border-top-left-radius: 50%;
  }

  .react-calendar__tile--rangeEnd {
    border-bottom-right-radius: 50%;
    border-top-right-radius: 50%;
  }

  /** DATE PICKER */

  .react-date-picker,
  .react-daterange-picker {
    width: 100%;

    margin: -8px -16px;

    color: #004466;
    font-family: 'Segoe UI';
  }

  .react-daterange-picker__wrapper,
  .react-date-picker__wrapper {
    width: 100%;
  }

  .react-date-picker input,
  .react-daterange-picker input {
    padding: 0;
    margin: 0;

    background: 0;
    border: 0;
  }

  .react-daterange-picker input:focus,
  .react-date-picker input:focus {
    border: 0;
  }

  .react-daterange-picker .react-daterange-picker__wrapper,
  .react-date-picker .react-date-picker__wrapper {
    border: 0;
  }

  .react-daterange-picker__calendar-button,
  .react-date-picker__calendar-button {
    padding: 0 !important;
  }

  /*.react-daterange-picker__calendar-button > svg,
.react-date-picker__calendar-button > svg {
    stroke: rgba(0, 68, 102, .1);
}

.react-daterange-picker__calendar-button:enabled:hover svg.react-daterange-picker__button__icon,
.react-date-picker__calendar-button:enabled:hover svg.react-date-picker__button__icon {
    stroke: #00bbff;
}*/

  .react-daterange-picker__calendar-button:enabled:focus,
  .react-date-picker__calendar-button:enabled:focus {
    outline: 0;
  }

  /*.react-daterange-picker__calendar-button:enabled:focus svg.react-daterange-picker__button__icon,
.react-date-picker__calendar-button:enabled:focus svg.react-date-picker__button__icon {
    stroke: #004466;
}

.react-daterange-picker__calendar-button:enabled:focus svg.react-daterange-picker__button__icon > rect,
.react-date-picker__calendar-button:enabled:focus svg.react-date-picker__button__icon > rect {
    fill: #00bbff;
}*/

  .react-daterange-picker__inputGroup:first-child {
    justify-content: flex-end;
  }

  .react-date-picker__inputGroup {
    justify-content: center;
  }

  .react-daterange-picker__range-divider {
    margin: 3px 2px 0;
  }

  /** SWITCH */
  .react-switch {
    margin: -6px -16px -10px !important;
  }
`;

export const FormCardRow = styled.div`
  display: table-row;
  flex-direction: row;

  &:last-child,
  &:last-of-type,
  &.no-border {
    ${FormCardRowHeader}, ${FormCardRowContent} {
      border: 0;
    }
  }
`;

const Selectable = styled.span`
  user-select: all;
`;
