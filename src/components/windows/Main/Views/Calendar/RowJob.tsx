import getCalendarDays from '../../../../../api/calendar/overwiev';
import jobDelete from '../../../../../api/job-delete';
import movePhaseCapacity from '../../../../../api/move-phase-capacity';
import React, { HTMLAttributes } from 'react';
import showPhaseMoveModal from '../../../../../utils/showPhaseMoveModal';
import styled from 'styled-components';
import ucfirst from '../../../../../utils/ucfirst';
import { CalendarDataType } from '../../../../../types/calendar';
import { connect } from 'react-redux';
import { ContextMenuTrigger } from 'react-contextmenu';
import { getColorWithOpacity } from '../../../../../styles/theme';
import { getDateString, isNonWorkingDay } from '../../../../../utils/days';
import { JobType } from '../../../../../types/job';
import { setCalendarData } from '../../../../../actions/calendar';
import { SettingsType } from '../../../../../types/settings';
import { useTranslation } from 'react-i18next';
import {
  CalendarRowHeader,
  CalendarDays,
  CalendarDay,
  Row,
} from '../../../../../styles/global';
import {
  MSGBOX_BUTTON_YES,
  MSGBOX_BUTTONS_OK,
  MSGBOX_BUTTONS_YES_NO,
  MSGBOX_TYPE_ERROR,
  MSGBOX_TYPE_INFO,
  MSGBOX_TYPE_WARNING,
  showMessageBox,
} from '../../../../../utils/showMessageBox';
import {
  getNextState,
  JOB_STATE_CREATED,
  JOB_STATE_IN_ARCHIVE,
  jobSetState,
} from '../../../../../api/job-set-state';

const mapStateToProps = (state, ownProps) => {
  return {
    days: state.days,
    job: state.jobs[ownProps.jobId],
    token: state.token,
    settings: state.settings,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    setCalendarData: (data: CalendarDataType) =>
      dispatch(setCalendarData(data)),
  };
}

const phases = ['saw', 'press', 'transport', 'construction']; // TODO: change to external constant

interface RowJobProps {
  days: Date[];
  job: JobType;
  token: string;
  settings: SettingsType;
  setCalendarData: (data: CalendarDataType) => void;
}

const RowJobComponent = (props: RowJobProps) => {
  const onDragStart = (e, data) => {
    e.dataTransfer.setData(JSON.stringify(data), '');
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const onDragOver = (e, data) => {
    const draggedData = JSON.parse(e.dataTransfer.types[0]);

    if (
      draggedData.jobid === data.jobId.toLowerCase() &&
      draggedData.phase === data.phase.toLowerCase() &&
      draggedData.date !== data.date
    )
      e.preventDefault();
  };

  const onDragEnter = (e, data) => {
    const draggedData = JSON.parse(e.dataTransfer.types[0]);

    if (
      draggedData.jobid === data.jobId.toLowerCase() &&
      draggedData.phase === data.phase.toLowerCase() &&
      draggedData.date !== data.date
    )
      e.target.closest('.droppable').classList.add('dropped');
  };

  const onDragLeave = (e) => {
    e.target.closest('.droppable').classList.remove('dropped');
  };

  const onDrop = (e, data) => {
    e.target.closest('.droppable').classList.remove('dropped');

    const draggedData = JSON.parse(e.dataTransfer.types[0]);

    if (data.phase !== 'transport') {
      showPhaseMoveModal(
        props.settings.url,
        props.token,
        props.job.place + ', ' + props.job.type,
        data.phase,
        draggedData.phaseid,
        draggedData.date,
        data.date,
        draggedData.maxcapacity,
        dragDropCallback
      );
    } else {
      movePhaseCapacity(
        props.settings.url,
        props.token,
        data.phase,
        'moveCapacity',
        draggedData.phaseid,
        data.date,
        0,
        dragDropCallback
      );
    }
  };

  const dragDropCallback = (result) => {
    if (result.status === 200) {
      fetchJobs();

      showMessageBox('calendar:rowJob.moveCapacity');
    } else {
      showMessageBox('FAILED', MSGBOX_TYPE_ERROR); // TODO
    }
  };

  const handleJobDelete = () => {
    showMessageBox(
      'jobForms:delete',
      MSGBOX_TYPE_WARNING,
      MSGBOX_BUTTONS_YES_NO,
      (button) => {
        if (button === MSGBOX_BUTTON_YES)
          jobDelete(props.settings.url, props.token, props.job.id, (res) => {
            fetchJobs();

            if (res.status === 200) {
              showMessageBox(
                'jobForms:deleted',
                MSGBOX_TYPE_INFO,
                MSGBOX_BUTTONS_OK
              );
            }
          });
      }
    );
  };

  const handleNextState = () => {
    const callback = (res) => {
      fetchJobs();

      if (res.status === 200)
        showMessageBox('OK' /* TODO */, MSGBOX_TYPE_INFO, MSGBOX_BUTTONS_OK);
    };

    if (props.job.state === JOB_STATE_CREATED)
      showMessageBox(
        'Recalculate?' /* TODO */,
        MSGBOX_TYPE_WARNING,
        MSGBOX_BUTTONS_YES_NO,
        (button) => {
          if (button === MSGBOX_BUTTON_YES)
            jobSetState(
              props.settings.url,
              props.token,
              props.job.id,
              getNextState(props.job.state),
              (res) => {
                callback(res);
              }
            );
        }
      );
    else
      jobSetState(
        props.settings.url,
        props.token,
        props.job.id,
        getNextState(props.job.state),
        (res) => {
          callback(res);
        }
      );
  };

  const fetchJobs = async () => {
    if (props.token !== null) {
      await getCalendarDays(
        props.settings.url,
        props.token,
        getDateString(props.days[0]),
        getDateString(props.days[props.days.length - 1]),
        (res) => {
          if (res.status === 200) props.setCalendarData(res.body);
        }
      );
    }
  };

  const { t } = useTranslation();

  let phaseDatesToIndex = {};
  phases.forEach((phase) => {
    phaseDatesToIndex[phase] = {};

    if (props.job.phases && props.job.phases[phase])
      props.job.phases[phase].forEach((entry, index) => {
        phaseDatesToIndex[phase][entry.date] = index;
      });
  });

  return (
    <RowJobEl>
      <RowJobHeader view={props.settings.calendarView}>
        <JobName>
          {props.job.place}, {props.job.type}
        </JobName>
        <JobID>
          <small>{t('calendar:rowJob.header.jobId')}:</small>{' '}
          {props.job.identification}
        </JobID>
        <JobDeadline>
          <small>{t('calendar:rowJob.header.deadline')}:</small>{' '}
          {props.job.deadline}
        </JobDeadline>
        <JobStatus>
          <small>{t('calendar:rowJob.header.status')}:</small>
          <Status>
            <StatusDeleteButton title='Smazat' onClick={handleJobDelete}>
              X
            </StatusDeleteButton>
            <StatusCurrentButton>
              {t('calendar:rowJob.header.statuses.' + props.job.state)}
            </StatusCurrentButton>
            <StatusNextButton onClick={handleNextState}>
              {props.job.state !== JOB_STATE_IN_ARCHIVE &&
                t(
                  'calendar:rowJob.header.statuses.' +
                    getNextState(props.job.state)
                )}
            </StatusNextButton>
          </Status>
        </JobStatus>
      </RowJobHeader>

      <CalendarDays>
        {props.days.map((day) => {
          let contents = {};
          let phaseAppearance = {};

          phases.forEach((phase) => {
            const dragData = {
              jobId: props.job.id,
              phase: phase,
              date: getDateString(day),
            };

            const attributes = {
              'job-id': props.job.id,
              phase: phase,
              day: getDateString(day),
            };

            if (phaseDatesToIndex[phase].hasOwnProperty(getDateString(day))) {
              let hasBefore = phaseDatesToIndex[phase].hasOwnProperty(
                getDateString(new Date(Date.parse(day.toString()) - 86400000))
              );
              let hasAfter = phaseDatesToIndex[phase].hasOwnProperty(
                getDateString(new Date(Date.parse(day.toString()) + 86400000))
              );

              if (hasBefore && hasAfter) phaseAppearance[phase] = 'continuous';
              else if (hasBefore) phaseAppearance[phase] = 'end';
              else if (hasAfter) phaseAppearance[phase] = 'start';
              else phaseAppearance[phase] = 'startEnd';

              const phaseObject =
                props.job.phases[phase][
                  phaseDatesToIndex[phase][getDateString(day)]
                ];
              contents[phase] = (
                <ContextMenuTrigger
                  id={'Phase' + ucfirst(phase) + 'Menu'}
                  attributes={attributes as HTMLAttributes<any>}
                  holdToDisplay={-1}
                >
                  <Droppable
                    className='droppable'
                    onDragOver={(e) => onDragOver(e, dragData)}
                    onDragEnter={(e) => onDragEnter(e, dragData)}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, dragData)}
                  >
                    <div
                      draggable
                      onDragStart={(e) =>
                        onDragStart(e, {
                          jobId: props.job.id,
                          phase: phase,
                          phaseId: phaseObject.id,
                          date: getDateString(day),
                          maxCapacity: phaseObject.consumption,
                        })
                      }
                    >
                      <ClassicView
                        phase={phase}
                        view={props.settings.calendarView}
                        key={getDateString(day) + '-classic'}
                      >
                        <ClassicDay view={props.settings.calendarView}>
                          {day.getDate()}
                        </ClassicDay>
                        <ClassicCapacity view={props.settings.calendarView}>
                          {phaseObject.consumption}
                        </ClassicCapacity>
                      </ClassicView>
                      <CompactView
                        phase={phase}
                        view={props.settings.calendarView}
                        key={getDateString(day) + '-compact'}
                      />
                    </div>
                  </Droppable>
                </ContextMenuTrigger>
              );
            } else {
              contents[phase] = (
                <ContextMenuTrigger
                  id={'EmptyPhaseMenu'}
                  attributes={attributes as HTMLAttributes<any>}
                  holdToDisplay={-1}
                >
                  <Droppable
                    className='empty droppable'
                    view={props.settings.calendarView}
                    onDragOver={(e) => onDragOver(e, dragData)}
                    onDragEnter={(e) => onDragEnter(e, dragData)}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, dragData)}
                  />
                </ContextMenuTrigger>
              );
            }
          });

          return (
            <Day
              isWeekStart={day.getDay() === 1}
              isNonWorkDay={isNonWorkingDay(day)}
            >
              <Contract />

              <DayPhase appearance={phaseAppearance['saw']}>
                {contents['saw']}
              </DayPhase>

              <DayPhase appearance={phaseAppearance['press']}>
                {contents['press']}
              </DayPhase>

              <DayPhase appearance={phaseAppearance['transport']}>
                {contents['transport']}
              </DayPhase>
              <DayPhase appearance={phaseAppearance['construction']}>
                {contents['construction']}
              </DayPhase>
            </Day>
          );
        })}
      </CalendarDays>
    </RowJobEl>
  );
};

const RowJob = connect(mapStateToProps, mapDispatchToProps)(RowJobComponent);
export default RowJob;

const RowJobEl = styled(Row)`
  background-color: white;

  transition: all 0.2s ease-out;

  &:hover {
    z-index: 1;

    box-shadow: 0 0 16px 0
      ${(props) => getColorWithOpacity(props.theme.colors.black, 20)};
    /*background-color: rgba(0, 187, 255, .1);*/
  }
`;

const JobHeaderElement = styled.div`
  margin-top: 4px;

  font-weight: 400;

  > small {
    margin-right: 4px;

    font-weight: 300;
  }
`;

const JobName = styled.div`
  font-weight: 500;
  font-size: 16px;
`;

const JobID = styled(JobHeaderElement)``;

const JobDeadline = styled(JobHeaderElement)``;

const JobStatus = styled(JobHeaderElement)``;

const Status = styled.div`
  display: inline-block;

  margin-right: -6px;
`;

const StatusButton = styled.button`
  position: relative;

  background-color: transparent;
  border: 1px solid ${(props) => props.theme.colors.black};
  border-radius: 9px;
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  opacity: 0.6;

  transition: all 0.2s ease-out;

  &:focus {
    outline: none;
  }

  &:hover {
    cursor: pointer;

    opacity: 1;
  }
`;

const StatusDeleteButton = styled(StatusButton)`
  z-index: 1;

  padding: 0 18px 0 6px;

  border-color: ${(props) => props.theme.colors.danger};
  color: ${(props) => props.theme.colors.danger};

  &:hover {
    background-color: ${(props) => props.theme.colors.danger};
    color: ${(props) => props.theme.colors.white};
  }
`;

const StatusCurrentButton = styled(StatusButton)`
  z-index: 3;

  margin-right: -16px;
  margin-left: -16px;

  padding: 1px 6px;

  background-color: ${(props) => props.theme.colors.primary};
  border-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  opacity: 1;

  cursor: default;
  transition: none;
`;

const StatusNextButton = styled(StatusButton)`
  z-index: 2;

  padding: 0 6px 0 18px;

  border-color: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.accent};

  &:hover {
    background-color: ${(props) => props.theme.colors.accent};
    color: ${(props) => props.theme.colors.white};
  }
`;

const RowJobHeader = styled(CalendarRowHeader)`
  ${JobID}, ${JobDeadline}, ${JobStatus} {
    display: ${(props) => (props.view === 'compact' ? 'none' : 'block')};
  }
`;

const Day = styled(CalendarDay)`
  align-items: center;

  color: ${(props) => props.theme.colors.white};
`;

const Contract = styled.div`
  position: relative;

  width: 100%;
`;

const Droppable = styled.div`
  position: relative;

  &:after {
    content: '';

    box-sizing: border-box;
    position: absolute;

    height: 32px;
    width: 32px;

    top: -2px;
    left: 50%;

    transform: translateX(-50%);

    background: ${(props) => getColorWithOpacity(props.theme.colors.black, 5)};
    border: 1px dashed
      ${(props) => getColorWithOpacity(props.theme.colors.black, 20)};
    border-radius: 16px;

    opacity: 0;

    pointer-events: none;
  }

  &.dropped:after {
    opacity: 1;
  }

  &.empty {
    height: ${(props) => (props.view === 'compact' ? '6px' : '28px')};
  }

  &.empty:active {
    background-color: ${(props) =>
      getColorWithOpacity(props.theme.colors.accent, 20)};
  }
`;

const ClassicValue = styled.span`
  position: relative;
  z-index: 1;

  top: 2px;
  left: 2px;

  display: block;

  height: 24px;
  width: 24px;
  line-height: 24px;

  border-radius: 14px;

  transition: all 0.1s ease-out;
`;

const View = styled.div`
  width: 28px;

  margin: auto;

  text-align: center;

  &,
  &:after {
    background-color: ${(props) =>
      props.phase === 'saw'
        ? props.theme.colors.danger
        : props.phase === 'press'
        ? props.theme.colors.accent
        : props.phase === 'transport'
        ? props.theme.colors.success
        : props.phase === 'construction'
        ? props.theme.colors.warning
        : 'transparent'};
  }
`;

const ClassicView = styled(View)`
  height: 28px;

  border-radius: 14px;

  display: ${(props) => (props.view.includes('classic') ? 'block' : 'none')};

  &:hover ${ClassicValue} {
    box-shadow: 0 0 8px 0
      ${(props) => getColorWithOpacity(props.theme.colors.black, 50)};
    background-color: ${(props) =>
      getColorWithOpacity(props.theme.colors.white, 10)};

    cursor: default;
  }
`;

const ClassicDay = styled(ClassicValue)`
  font-size: 14px;

  display: ${(props) => (props.view === 'classicDays' ? 'block' : 'none')};
`;

const ClassicCapacity = styled(ClassicValue)`
  font-size: 12px;

  display: ${(props) =>
    props.view === 'classicCapacities' ? 'block' : 'none'};
`;

const CompactView = styled(View)`
  height: 6px;

  border-radius: 3px;

  display: ${(props) => (props.view === 'compact' ? 'block' : 'none')};
`;

const DayPhase = styled.div`
  position: relative;

  width: 100%;

  margin: 2px 0;

  ${ClassicView}:after, ${CompactView}:after {
    content: '';

    position: absolute;

    top: 0;
    left: ${(props) =>
      props.appearance === 'continuous' || props.appearance === 'end'
        ? '0'
        : '50%'};
    right: ${(props) =>
      props.appearance === 'continuous' || props.appearance === 'start'
        ? '0'
        : '50%'};
  }

  ${ClassicView}:after {
    height: 28px;
  }

  ${CompactView}:after {
    height: 6px;
  }
`;
