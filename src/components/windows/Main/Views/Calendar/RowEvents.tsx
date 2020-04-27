import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getColorWithOpacity } from '../../../../../styles/theme';
import { isNonWorkingDay } from '../../../../../utils/days';
import { useTranslation } from 'react-i18next';
//import triangle from '../../../../../icons/triangle.png';
import {
  CalendarRow,
  CalendarRowHeader,
  CalendarDays,
  CalendarDay,
} from '../../../../../styles/global';

const mapStateToProps = (state) => {
  return { days: state.days };
};

interface RowEventsProps {
  days: Date[];
}

const RowEventsComponent = (props: RowEventsProps) => {
  const { t } = useTranslation();

  return (
    <RowEventsEl>
      <RowEventsHeader>{t('calendar:rowEvents.header')}</RowEventsHeader>

      <CalendarDays>
        {props.days.map((day) => {
          return (
            <Day
              isWeekStart={day.getDay() === 1}
              isNonWorkDay={isNonWorkingDay(day)}
            >
              {/*<img src={triangle} alt="warning" width="32" height="32"/>*/}
            </Day>
          );
        })}
      </CalendarDays>
    </RowEventsEl>
  );
};

const RowEvents = connect(mapStateToProps)(RowEventsComponent);
export default RowEvents;

const RowEventsEl = styled(CalendarRow)`
  background-color: white;
`;

const RowEventsHeader = styled(CalendarRowHeader)``;

const Day = styled(CalendarDay)`
  border-bottom: 1px solid
    ${(props) => getColorWithOpacity(props.theme.colors.black, 10)};
  align-items: center;
  padding: 4px 0;
`;
