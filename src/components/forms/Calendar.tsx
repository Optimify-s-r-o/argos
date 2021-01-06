import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Calendar, DateRange } from 'react-date-range';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate, parseDate } from './Calendar/locale';
import { getColorWithOpacity } from '../../styles/theme';
import { useTranslation } from 'react-i18next';
import './Calendar/styles.css';
import './Calendar/default.css';

interface ComponentProps {
  name: string;
  onChange: (e) => void;
  direction?: 'down' | 'up';
  tabIndex?: number;
}

interface DateProps {
  value: Date;
}

export const DatePicker = (props: ComponentProps & DateProps) => {
  const { i18n } = useTranslation();
  const [value, setValue] = useState(props.value);
  const [inputValue, setInputValue] = useState(
    formatDate(props.value, i18n.language)
  );
  const [closeCalendarVar, setCloseCalendarVar] = useState<0 | 1>(0);
  const [hasError, setError] = useState(false);

  useEffect(() => {
    setInputValue(formatDate(value, i18n.language));
    props.onChange({ target: { value: value, type: 'date' } });
  }, [value]);

  const closeCalendar = () => {
    setCloseCalendarVar(closeCalendarVar === 0 ? 1 : 0);
  };

  return (
    <CalendarComponent
      value={value}
      direction={props.direction}
      inputContent={inputValue}
      inputChanged={(newValue) => {
        setInputValue(newValue);
        const newDate = parseDate(newValue, i18n.language);
        if (newDate) {
          setValue(newDate);
          setError(false);
        } else setError(true);
      }}
      calendarContent={
        <Calendar
          date={value}
          onChange={(calendar) => {
            setValue(calendar);
            closeCalendar();
          }}
          color={'#00bbff'}
        />
      }
      closeCalendar={closeCalendarVar}
      tabIndex={props.tabIndex}
      hasError={hasError}
    />
  );
};

interface DateRangeProps {
  value: {
    startDate: Date;
    endDate: Date;
  };
}

export const DateRangePicker = (props: ComponentProps & DateRangeProps) => {
  const { i18n } = useTranslation();
  const [value, setValue] = useState(props.value);
  const [innerValue, setInnerValue] = useState(props.value);
  const [inputValue, setInputValue] = useState(
    formatDate(props.value.startDate, i18n.language) +
      ' - ' +
      formatDate(props.value.endDate, i18n.language)
  );
  const [changeOnNextChange, setChangeOnNextChange] = useState(false);
  const [closeCalendarVar, setCloseCalendarVar] = useState<0 | 1>(0);
  const [hasError, setError] = useState(false);

  useEffect(() => {
    setInputValue(
      formatDate(value.startDate, i18n.language) +
        ' - ' +
        formatDate(value.endDate, i18n.language)
    );
    props.onChange({ target: { value: value, type: 'dateRange' } });
  }, [value]);

  const closeCalendar = () => {
    setCloseCalendarVar(closeCalendarVar === 0 ? 1 : 0);
  };

  return (
    <CalendarComponent
      value={value}
      direction={props.direction}
      inputContent={inputValue}
      inputChanged={(newValue) => {
        setInputValue(newValue);
        const dates = newValue.split(' - ');
        const newDates = [
          parseDate(dates[0], i18n.language),
          parseDate(dates[1], i18n.language),
        ];
        if (newDates[0] && newDates[1]) {
          setValue({ startDate: newDates[0], endDate: newDates[1] });
          setInnerValue({ startDate: newDates[0], endDate: newDates[1] });
          setError(false);
        } else setError(true);
      }}
      calendarContent={
        <DateRange
          ranges={[
            {
              startDate: innerValue.startDate,
              endDate: innerValue.endDate,
              key: 'selection',
            },
          ]}
          onChange={(calendar) => {
            setInnerValue(calendar.selection);
            if (changeOnNextChange) {
              setValue(calendar.selection);
              closeCalendar();
            }
          }}
          onRangeFocusChange={(e) => {
            setChangeOnNextChange(e[1] === 1);
          }}
          rangeColors={['#00bbff']}
          moveRangeOnFirstSelection={false}
        />
      }
      closeCalendar={closeCalendarVar}
      tabIndex={props.tabIndex}
      hasError={hasError}
    />
  );
};

const CalendarComponent = (props: {
  value: any;
  inputContent: any;
  inputChanged: (newValue: string) => void;
  calendarContent: any;
  closeCalendar: 0 | 1;
  direction?: string;
  tabIndex?: number;
  hasError?: boolean;
}) => {
  const [isFocused, setFocused] = useState(false);

  useEffect(() => {
    setFocused(false);
  }, [props.closeCalendar]);

  return (
    <Wrapper>
      <CalendarInput
        type='text'
        value={props.inputContent}
        onChange={(e) => props.inputChanged(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') setFocused(isFocused ? false : true);
        }}
        tabIndex={props.tabIndex}
        hasError={props.hasError}
      />
      <CalendarIcon
        tabIndex={-1}
        onClick={() => setFocused(isFocused ? false : true)}
        isFocused={isFocused}
      >
        <FontAwesomeIcon icon={faCalendarAlt} />
      </CalendarIcon>
      <ComponentWrapper isFocused={isFocused} direction={props.direction}>
        {props.calendarContent}
      </ComponentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;

  position: relative;
`;

const CalendarInput = styled.input<{ hasError?: boolean }>`
  flex-grow: 1;

  margin: 0.5rem 1rem;
  padding: 0.75rem calc(1.5rem + 38px) 0.75rem 1.5rem;

  border: 0;
  border-radius: 999px;
  box-shadow: 0 5px 10px -5px ${(props) =>
      getColorWithOpacity(props.theme.colors.primary, 25)} ${(props) => (props.hasError ? ', inset 0 0 0 1px ' + props.theme.colors.danger : '')};
  font-family: 'Segoe UI';
  text-align: center;

  transition: box-shadow 0.2s ease-out;

  &:focus {
    box-shadow: 0 5px 25px -10px ${(props) =>
        getColorWithOpacity(props.theme.colors.accent, 50)} ${(props) => (props.hasError ? ', inset 0 0 0 1px ' + props.theme.colors.danger : '')};

    outline: 0;
  }
`;

const CalendarIcon = styled.button<{ isFocused: boolean }>`
  position: absolute;

  top: 0.5rem;
  right: 1rem;

  width: 38px;
  line-height: 38px;

  padding: 0 10px 0 6px;

  background: transparent;
  border: 0;
  border-left: 1px solid
    ${(props) => getColorWithOpacity(props.theme.colors.primary, 10)};
  border-radius: 0 19px 19px 0;
  color: ${(props) =>
    props.isFocused
      ? props.theme.colors.accent
      : getColorWithOpacity(props.theme.colors.primary, 50)};
  font-size: 16px;

  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover,
  &:active,
  &:focus {
    color: ${(props) =>
      props.isFocused ? props.theme.colors.accent : props.theme.colors.primary};
  }

  &:focus {
    outline: 0;
  }
`;

const ComponentWrapper = styled.div<{ isFocused: boolean; direction?: string }>`
  display: ${(props) => (props.isFocused ? 'block' : 'none')};

  position: absolute;

  left: 1rem;
  right: 1rem;
  ${(props) =>
    (props.direction === 'up' ? 'bottom:' : 'top:') + ' calc(52px + 0.5rem)'};

  border-radius: 19px;
  box-shadow: 0 5px 35px -10px ${(props) =>
      getColorWithOpacity(props.theme.colors.primary, 60)} ${(props) => (props.hasError ? ', inset 0 0 0 1px ' + props.theme.colors.danger : '')};

  overflow: hidden;

  * {
    font-family: 'Segoe UI' !important;
  }
`;
