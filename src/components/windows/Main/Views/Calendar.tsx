import getCalendarDays from '../../../../api/calendar/overwiev';
import jobAddImg from '../../../../icons/add.png';
import OpenWindow, { openWindow } from '../../../OpenWindow';
import phasePartDelete from '../../../../api/phase/delete-phase-part';
import React, { useEffect, useState } from 'react';
import RowCapacities from './Calendar/RowCapacities';
import RowDays from './Calendar/RowDays';
import RowEvents from './Calendar/RowEvents';
import RowJob from './Calendar/RowJob';
import styled from 'styled-components';
import WeekSelector from './Calendar/WeekSelector';
import { CalendarDataType, JobsType } from '../../../../types/calendar';
import { CalendarRowHeader, Row } from '../../../../styles/global';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { EVENT_JOB_CREATED } from '../../../../events/jobs';
import { getDateString } from '../../../../utils/days';
import { getIpcRenderer, isElectron } from '../../../../utils/electron';
import { JobAddPath, JobAddSettings } from '../../JobAdd';
import { setCalendarData } from '../../../../actions/calendar';
import { SettingsType } from '../../../../types/settings';
import { useTranslation } from 'react-i18next';
import {
  CreatePhasePathWithParams,
  CreatePhaseSettings,
} from '../../CreatePhase';
import {
  getMultipliedColor,
  getColorWithOpacity,
} from '../../../../styles/theme';
import {
  CapacityChangePath,
  CapacityChangeSettings,
} from '../../CapacityChange';
import {
  MSGBOX_BUTTONS_OK,
  MSGBOX_TYPE_SUCCESS,
  showMessageBox,
} from '../../../../utils/showMessageBox';

interface CalendarProps {
  calendarView: string;
  days: Date[];
  jobs: JobsType;
  token: string;
  settings: SettingsType;
  setCalendarData: (data: CalendarDataType) => void;
}

const mapStateToProps = (state) => {
  return {
    calendarView: state.settings.calendarView,
    days: state.days,
    jobs: state.jobs,
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

const CalendarComponent = (props: CalendarProps) => {
  const [showJobsShadow, setShowJobsShadow] = useState(false);
  const [isLoadingJobs, setLoadingJobs] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isElectron()) {
      const ipcRenderer = getIpcRenderer();

      ipcRenderer.on('event-fired', (e, event, data) => {
        if (event === EVENT_JOB_CREATED) fetchJobs();
      });
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [props.days, props.token]);

  const fetchJobs = async () => {
    if (props.token !== null) {
      setLoadingJobs(true);
      await getCalendarDays(
        props.settings.url,
        props.token,
        getDateString(props.days[0]),
        getDateString(props.days[props.days.length - 1]),
        (res) => {
          if (res.status === 200) props.setCalendarData(res.body);
        }
      );
      setLoadingJobs(false);
    }
  };

  const handleMouseEnterRowJob = (index: number) => {
    if (index === 0) setShowJobsShadow(true);
  };

  const handleMouseLeaveRowJob = (index: number) => {
    if (index === 0) setShowJobsShadow(false);
  };

  const getContextMenuTargetData = (target) => {
    return {
      jobId: target.getAttribute('job-id'),
      jobGuid: target.getAttribute('job-guid'),
      jobLocation: target.getAttribute('job-location'),
      jobDescription: target.getAttribute('job-description'),
      phase: target.getAttribute('phase'),
      phasePartId: target.getAttribute('phase-part-id'),
      date: target.getAttribute('day'),
    };
  };

  const contextMenuChangeCapacity = (e, data, target) => {
    const targetData = getContextMenuTargetData(target);
    console.log(targetData);
    openWindow(CapacityChangePath, CapacityChangeSettings);
  };

  const contextMenuMoveFreeCapacity = (e, data, target) => {
    const targetData = getContextMenuTargetData(target);
    console.log(targetData);
  };

  const contextMenuChangeTransportInfo = (e, data, target) => {
    const targetData = getContextMenuTargetData(target);
    console.log(targetData);
  };

  const contextMenuRemovePhase = (e, data, target) => {
    const targetData = getContextMenuTargetData(target);
    phasePartDelete(
      props.settings.url,
      props.token,
      targetData.phase,
      targetData.phasePartId,
      (data) => {
        if (data.status === 200) {
          showMessageBox(
            'calendar:rowJob.deletePhasePart',
            MSGBOX_TYPE_SUCCESS,
            MSGBOX_BUTTONS_OK
          );
          fetchJobs();
        }
      }
    );
  };

  const contextMenuCreatePhase = (e, data, target) => {
    const targetData = getContextMenuTargetData(target);
    console.log(targetData);
    openWindow(
      CreatePhasePathWithParams(
        props.settings.url,
        props.token,
        targetData.phase,
        targetData.date,
        targetData.jobId,
        targetData.jobGuid,
        targetData.jobLocation,
        targetData.jobDescription
      ),
      CreatePhaseSettings,
      () => {},
      () => {
        fetchJobs();
      }
    );
  };

  return (
    <CalendarEl isLoading={isLoadingJobs}>
      <WeekSelector />
      <RowDays />
      <RowEvents />
      <RowCapacities />
      <Jobs
        showShadow={showJobsShadow}
        className={
          'view' +
          props.calendarView.charAt(0).toUpperCase() +
          props.calendarView.slice(1) +
          (showJobsShadow ? ' show-shadow' : '')
        }
      >
        {Object.keys(props.jobs).map((job, index) => {
          return (
            <div
              key={'job-' + job}
              onMouseEnter={(e) => handleMouseEnterRowJob(index)}
              onMouseLeave={(e) => handleMouseLeaveRowJob(index)}
            >
              <RowJob jobId={job} />
            </div>
          );
        })}

        <RowJobAdd>
          <OpenWindow
            path={
              JobAddPath +
              '?url=' +
              props.settings.url +
              '&token=' +
              props.token
            }
            windowSettings={JobAddSettings}
          >
            <HeaderAddJob>
              <img src={jobAddImg} alt={t('calendar:addJob')} />
              <span>{t('calendar:addJob')}</span>
            </HeaderAddJob>
          </OpenWindow>
        </RowJobAdd>

        <ContextMenu id={'PhaseSawMenu'}>
          <MenuItem onClick={contextMenuChangeCapacity}>
            {t('calendar:rowJob.phaseContextMenu.changeCapacity')}
          </MenuItem>
          <MenuItem onClick={contextMenuMoveFreeCapacity}>
            {t('calendar:rowJob.phaseContextMenu.moveFreeCapacity')}
          </MenuItem>
          <MenuItem divider />
          <MenuItem onClick={contextMenuRemovePhase}>
            <span className='danger'>
              {t('calendar:rowJob.phaseContextMenu.removePhase')}
            </span>
          </MenuItem>
        </ContextMenu>

        <ContextMenu id={'PhasePressMenu'}>
          <MenuItem onClick={contextMenuChangeCapacity}>
            {t('calendar:rowJob.phaseContextMenu.changeCapacity')}
          </MenuItem>
          <MenuItem onClick={contextMenuMoveFreeCapacity}>
            {t('calendar:rowJob.phaseContextMenu.moveFreeCapacity')}
          </MenuItem>
          <MenuItem divider />
          <MenuItem onClick={contextMenuRemovePhase}>
            <span className='danger'>
              {t('calendar:rowJob.phaseContextMenu.removePhase')}
            </span>
          </MenuItem>
        </ContextMenu>

        <ContextMenu id={'PhaseTransportMenu'}>
          <MenuItem onClick={contextMenuChangeTransportInfo}>
            {t('calendar:rowJob.phaseContextMenu.changeTransportInfo')}
          </MenuItem>
          <MenuItem divider />
          <MenuItem onClick={contextMenuRemovePhase}>
            <span className='danger'>
              {t('calendar:rowJob.phaseContextMenu.removePhase')}
            </span>
          </MenuItem>
        </ContextMenu>

        <ContextMenu id={'PhaseConstructionMenu'}>
          <MenuItem onClick={contextMenuRemovePhase}>
            <span className='danger'>
              {t('calendar:rowJob.phaseContextMenu.removePhase')}
            </span>
          </MenuItem>
        </ContextMenu>

        <ContextMenu id={'EmptyPhaseMenu'}>
          <MenuItem onClick={contextMenuCreatePhase}>
            {t('calendar:rowJob.phaseContextMenu.createPhase')}
          </MenuItem>
        </ContextMenu>
      </Jobs>
    </CalendarEl>
  );
};

const Calendar = connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarComponent);

export default Calendar;

const CalendarEl = styled.div`
  display: flex;
  position: absolute;

  overflow: hidden;

  flex-direction: column;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-color: ${(props) =>
    getMultipliedColor(props.theme.colors.white, 0.933)};

  &:after {
    content: '';

    position: absolute;
    z-index: 99999;

    top: 60px; /* week selector */
    right: 0;
    bottom: 0;
    left: 0;

    display: ${(props) => (props.isLoading ? 'block' : 'none')};

    background-color: ${(props) =>
      getColorWithOpacity(props.theme.colors.accent, 0.25)};
    background-image: url('../icons/loader.gif');
    background-position: center center;
    background-repeat: no-repeat;
  }
`;

const Jobs = styled.div`
  display: block;
  position: relative;

  flex-grow: 1;

  overflow-y: scroll;

  transition: all 0.2s ease-out;

  box-shadow: ${(props) =>
    props.showShadow
      ? '0 0 16px 0 ' + getColorWithOpacity(props.theme.colors.black, 20)
      : 'none'};
`;

const RowJobAdd = styled(Row)``;

const HeaderAddJob = styled(CalendarRowHeader)`
  padding: 24px 24px;

  opacity: 0.5;

  span {
    position: relative;

    top: -8px;
    left: 8px;

    font-size: 16px;
  }

  &:hover {
    cursor: pointer;
    opacity: 1;
  }

  &:after {
    content: none;
  }
`;
