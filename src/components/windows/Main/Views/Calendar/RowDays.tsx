import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getColorWithOpacity } from '../../../../../styles/theme';
import { isNonWorkingDay } from '../../../../../utils/days';
import { useTranslation } from 'react-i18next';
import {
  CalendarDays,
  CalendarRow,
  CalendarRowHeader,
  CalendarDay,
} from '../../../../../styles/global';

function getWeekNumber(day) {
  let date = new Date(
    Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())
  );
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));

  let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  return Math.ceil(((date.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7);
}

const mapStateToProps = (state) => {
  return { days: state.days };
};

interface RowDaysProps {
  days: Date[];
}

const RowDaysComponent = (props: RowDaysProps) => {
  const { t } = useTranslation();

  return (
    <RowDaysEl>
      <RowDaysHeader></RowDaysHeader>

      <CalendarDays>
        {props.days.map((day) => {
          let weekNumber = '\u00a0';
          if (day.getDay() === 4)
            weekNumber = t('calendar:rowDays.week') + ' ' + getWeekNumber(day);

          return (
            <Day
              isWeekStart={day.getDay() === 1}
              isNonWorkDay={isNonWorkingDay(day)}
            >
              <WeekNumber>{weekNumber}</WeekNumber>
              <DayInWeek>
                {t('calendar:rowDays.days.' + day.getDay())}
              </DayInWeek>
              <DayInMonth>{day.getDate()}</DayInMonth>
            </Day>
          );
        })}
      </CalendarDays>
    </RowDaysEl>
  );
};

const RowDays = connect(mapStateToProps)(RowDaysComponent);
export default RowDays;

const RowDaysEl = styled(CalendarRow)`
  background-color: white;
`;

const RowDaysHeader = styled(CalendarRowHeader)`
  &:after {
    content: '';

    position: absolute;

    right: 0;
    bottom: 0;
    left: 0;

    height: 1px;

    background: ${(props) => getColorWithOpacity(props.theme.colors.accent, 0)};
    background: -moz-linear-gradient(
      left,
      ${(props) => getColorWithOpacity(props.theme.colors.accent, 0)} 0%,
      ${(props) => props.theme.colors.accent} 100%
    );
    background: -webkit-gradient(
      left top,
      right top,
      color-stop(
        0%,
        ${(props) => getColorWithOpacity(props.theme.colors.accent, 0)}
      ),
      color-stop(100%, ${(props) => props.theme.colors.accent})
    );
    background: -webkit-linear-gradient(
      left,
      ${(props) => getColorWithOpacity(props.theme.colors.accent, 0)} 0%,
      ${(props) => props.theme.colors.accent}100%
    );
    background: -o-linear-gradient(
      left,
      ${(props) => getColorWithOpacity(props.theme.colors.accent, 0)} 0%,
      ${(props) => props.theme.colors.accent} 100%
    );
    background: -ms-linear-gradient(
      left,
      ${(props) => getColorWithOpacity(props.theme.colors.accent, 0)} 0%,
      ${(props) => props.theme.colors.accent} 100%
    );
    background: linear-gradient(
      to right,
      ${(props) => getColorWithOpacity(props.theme.colors.accent, 0)} 0%,
      ${(props) => props.theme.colors.accent} 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=${(
      props
    ) => props.theme.colors.accent}, endColorstr=${(props) =>
  props.theme.colors.accent}, GradientType=1 );
  }
`;

const WeekNumber = styled.div`
  position: absolute;

  top: 0;
  left: -100%;
  right: -100%;

  padding: 6px 0;

  color: ${(props) => props.theme.colors.primary};
  text-align: center;
`;

const DayInWeek = styled.div`
  padding-bottom: 0 !important;

  font-size: 11px;
`;

const DayInMonth = styled.div``;

const Day = styled(CalendarDay)`
  position: relative;

  border-bottom: 1px solid ${(props) => props.theme.colors.accent};

  padding-top: 24px;

  > * {
    text-align: center;
    padding: 6px 0;
  }
`;
