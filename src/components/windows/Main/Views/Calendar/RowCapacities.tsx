import React from 'react';
import styled from 'styled-components';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { CapacitiesType } from '../../../../../types/calendar';
import { CapacitiesViewType } from '../../../../../types/settings';
import { connect } from 'react-redux';
import { defaultTheme } from '../../../../../styles/theme';
import { isNonWorkingDay } from '../../../../../utils/days';
import { phaseTypesWithCapacity } from '../../../../../enums/phases';
import { useTranslation } from 'react-i18next';
import 'react-circular-progressbar/dist/styles.css';
import {
  CalendarRow,
  CalendarRowHeader,
  CalendarDays,
  CalendarDay,
} from '../../../../../styles/global';

const mapStateToProps = (state) => {
  return {
    days: state.days,
    capacitiesView: state.settings.capacitiesView,
    capacities: state.capacities,
  };
};

interface RowCapacitiesProps {
  days: Date[];
  capacitiesView: CapacitiesViewType;
  capacities: CapacitiesType;
}

const RowCapacitiesComponent = (props: RowCapacitiesProps) => {
  const { t } = useTranslation();

  return (
    <RowCapacitiesEl>
      <RowCapacitiesHeader>
        {t('calendar:rowCapacities.header')}
      </RowCapacitiesHeader>

      <CalendarDays>
        {props.days.map((day, key) => {
          const phases = phaseTypesWithCapacity;
          const colors = {
            saw: defaultTheme.colors.danger,
            press: defaultTheme.colors.accent,
            construction: defaultTheme.colors.warning,
          };

          let capacities = {};

          phases.forEach((phase) => {
            capacities[phase] = {
              absolute: {
                used:
                  props.capacities && props.capacities[key]
                    ? props.capacities[key][phase].planned
                    : null,
                available:
                  props.capacities && props.capacities[key]
                    ? props.capacities[key][phase].free
                    : null,
                full:
                  props.capacities && props.capacities[key]
                    ? props.capacities[key][phase].shiftsCapacity
                    : null,
              },
              percentage:
                props.capacities && props.capacities[key]
                  ? 100 -
                    Math.round(
                      (props.capacities[key][phase].planned /
                        props.capacities[key][phase].shiftsCapacity) *
                        100
                    )
                  : null, // TODO: dividing by 0
            };
          });

          return (
            <Day
              isWeekStart={day.getDay() === 1}
              isNonWorkDay={isNonWorkingDay(day)}
            >
              {phases.map((phase) => {
                return (
                  <CapacitySection phase={phase}>
                    <CircularProgressbar
                      className='capacity-circle'
                      value={100}
                      text=''
                      strokeWidth={2}
                      styles={buildStyles({
                        pathColor: colors[phase],
                      })}
                    />
                    <CircularProgressbar
                      className='capacity-value'
                      value={capacities[phase].percentage}
                      text=''
                      strokeWidth={8}
                      styles={buildStyles({
                        strokeLinecap: 'butt',
                        pathColor: colors[phase],
                        trailColor: 'transparent',
                        pathTransition: 'none',
                      })}
                    />
                    <CapacityValueWrapper
                      show={props.capacitiesView === 'absolute'}
                      type='absolute'
                      phase={phase}
                    >
                      <span>{capacities[phase].absolute.available}</span>
                      <span>{capacities[phase].absolute.full}</span>
                    </CapacityValueWrapper>
                    <CapacityValueWrapper
                      show={props.capacitiesView === 'percentage'}
                      type='percentage'
                      phase={phase}
                    >
                      <span>{capacities[phase].percentage}</span>
                      <span>%</span>
                    </CapacityValueWrapper>
                  </CapacitySection>
                );
              })}
            </Day>
          );
        })}
      </CalendarDays>
    </RowCapacitiesEl>
  );
};

const RowCapacities = connect(mapStateToProps)(RowCapacitiesComponent);
export default RowCapacities;

const RowCapacitiesEl = styled(CalendarRow)`
  background-color: ${(props) => props.theme.colors.white};
`;

const RowCapacitiesHeader = styled(CalendarRowHeader)``;

const Day = styled(CalendarDay)``;

const CapacitySection = styled.div`
  position: relative;

  height: 32px;

  margin: 4px 0;

  font-weight: 400;

  .capacity-circle,
  .capacity-value {
    position: absolute;

    left: 50%;

    transform: translateX(-50%);
  }

  .capacity-circle {
    top: 2px;

    width: 28px;
  }

  .capacity-value {
    width: 32px;
  }

  color: ${(props) =>
    props.phase === 'saw'
      ? props.theme.colors.danger
      : props.phase === 'press'
      ? props.theme.colors.accent
      : props.phase === 'construction'
      ? props.theme.colors.warning
      : '#888'};
`;

const CapacityValueWrapper = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};

  position: absolute;

  top: 50%;
  left: 50%;

  transform: translateX(-50%);

  > span:first-child {
    position: absolute;

    top: -13px;
    left: 50%;

    transform: translateX(-50%);
    font-size: 12px;
  }

  > span:last-child {
    position: absolute;

    top: -1px;
    left: 50%;

    transform: translateX(-50%);
    font-size: 10px;
  }

  &:after {
    content: ${(props) => (props.type === 'absolute' ? `''` : 'none')};

    position: absolute;

    top: 1px;
    left: -12px;

    height: 1px;
    width: 24px;

    background-color: ${(props) =>
      props.phase === 'saw'
        ? props.theme.colors.danger
        : props.phase === 'press'
        ? props.theme.colors.accent
        : props.phase === 'construction'
        ? props.theme.colors.warning
        : '#888'};
  }
`;
