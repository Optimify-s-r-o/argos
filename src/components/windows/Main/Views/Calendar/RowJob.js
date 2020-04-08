import React from 'react';
import { connect } from 'react-redux';
import { isNonWorkingDay, getDateString } from '../../../../../utils/days';
import { ContextMenuTrigger } from 'react-contextmenu';
import { withTranslation } from 'react-i18next';
import ucfirst from '../../../../../utils/ucfirst';
import jobDelete from '../../../../../api/job-delete';
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
import showPhaseMoveModal from '../../../../../utils/showPhaseMoveModal';
import movePhaseCapacity from '../../../../../api/move-phase-capacity';
import getCalendarDays from '../../../../../api/calendar-days';
import { setCalendarData } from '../../../../../actions/calendar';

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
    setCalendarData: (data) => dispatch(setCalendarData(data)),
  };
}

const phases = ['saw', 'press', 'transport', 'construction']; // TODO: change to external constant

class RowJobComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleJobDelete = this.handleJobDelete.bind(this);
    this.handleNextState = this.handleNextState.bind(this);
    this.dragDropCallback = this.dragDropCallback.bind(this);
    this.fetchJobs = this.fetchJobs.bind(this);
  }

  onDragStart(e, data) {
    e.dataTransfer.setData(JSON.stringify(data), '');
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  }

  onDragOver(e, data) {
    const draggedData = JSON.parse(e.dataTransfer.types[0]);

    if (
      draggedData.jobid === data.jobId.toLowerCase() &&
      draggedData.phase === data.phase.toLowerCase() &&
      draggedData.date !== data.date
    )
      e.preventDefault();
  }

  onDragEnter(e, data) {
    const draggedData = JSON.parse(e.dataTransfer.types[0]);

    if (
      draggedData.jobid === data.jobId.toLowerCase() &&
      draggedData.phase === data.phase.toLowerCase() &&
      draggedData.date !== data.date
    )
      e.target.closest('.droppable').classList.add('dropped');
  }

  onDragLeave(e) {
    e.target.closest('.droppable').classList.remove('dropped');
  }

  onDrop(e, data) {
    e.target.closest('.droppable').classList.remove('dropped');

    const draggedData = JSON.parse(e.dataTransfer.types[0]);

    if (data.phase !== 'transport') {
      showPhaseMoveModal(
        this.props.settings.url,
        this.props.token,
        this.props.job.place + ', ' + this.props.job.type,
        data.phase,
        draggedData.phaseid,
        draggedData.date,
        data.date,
        draggedData.maxcapacity,
        this.dragDropCallback
      );
    } else {
      movePhaseCapacity(
        this.props.settings.url,
        this.props.token,
        data.phase,
        '',
        draggedData.phaseid,
        data.date,
        0,
        this.dragDropCallback
      );
    }
  }

  dragDropCallback(result) {
    if (result.status === 200) {
      this.fetchJobs();

      showMessageBox('calendar:rowJob.moveCapacity');
    } else {
      showMessageBox('FAILED', MSGBOX_TYPE_ERROR); // TODO
    }
  }

  handleJobDelete() {
    showMessageBox(
      'jobForms:delete',
      MSGBOX_TYPE_WARNING,
      MSGBOX_BUTTONS_YES_NO,
      (button) => {
        if (button === MSGBOX_BUTTON_YES)
          jobDelete(
            this.props.settings.url,
            this.props.token,
            this.props.job.id,
            (res) => {
              this.fetchJobs();

              if (res.status === 200) {
                showMessageBox(
                  'jobForms:deleted',
                  MSGBOX_TYPE_INFO,
                  MSGBOX_BUTTONS_OK
                );
              }
            }
          );
      }
    );
  }

  handleNextState() {
    const callback = (res) => {
      this.fetchJobs();

      if (res.status === 200)
        showMessageBox('OK' /* TODO */, MSGBOX_TYPE_INFO, MSGBOX_BUTTONS_OK);
    };

    if (this.props.job.State === JOB_STATE_CREATED)
      showMessageBox(
        'Recalculate?' /* TODO */,
        MSGBOX_TYPE_WARNING,
        MSGBOX_BUTTONS_YES_NO,
        (button) => {
          if (button === MSGBOX_BUTTON_YES)
            jobSetState(
              this.props.settings.url,
              this.props.token,
              this.props.job.id,
              getNextState(this.props.job.state),
              (res) => {
                callback(res);
              }
            );
        }
      );
    else
      jobSetState(
        this.props.settings.url,
        this.props.token,
        this.props.job.id,
        getNextState(this.props.job.state),
        (res) => {
          callback(res);
        }
      );
  }

  async fetchJobs() {
    if (this.props.token !== null) {
      await getCalendarDays(
        this.props.settings.url,
        this.props.token,
        getDateString(this.props.days[0]),
        getDateString(this.props.days[this.props.days.length - 1]),
        (res) => {
          if (res.status === 200) this.props.setCalendarData(res.body);
        }
      );
    }
  }

  render() {
    const { t } = this.props;

    let phaseDatesToIndex = {};
    phases.forEach((phase) => {
      phaseDatesToIndex[phase] = {};

      if (this.props.job.phases && this.props.job.phases[phase])
        this.props.job.phases[phase].forEach((entry, index) => {
          phaseDatesToIndex[phase][entry.date] = index;
        });
    });

    return (
      <div className='Row RowJob'>
        <div className='RowHeader HeaderJob'>
          <div className='JobName'>
            {this.props.job.place}, {this.props.job.type}
          </div>
          <div className='JobID'>
            <small>{t('calendar:rowJob.header.jobId')}:</small>{' '}
            {this.props.job.identification}
          </div>
          <div className='JobDeadline'>
            <small>{t('calendar:rowJob.header.deadline')}:</small>{' '}
            {this.props.job.deadline}
          </div>
          <div className='JobStatus'>
            <small>{t('calendar:rowJob.header.status')}:</small>
            <div className='status'>
              <button title='Smazat' onClick={this.handleJobDelete}>
                X
              </button>
              <button>
                {t('calendar:rowJob.header.statuses.' + this.props.job.state)}
              </button>
              <button onClick={this.handleNextState}>
                {this.props.job.state !== JOB_STATE_IN_ARCHIVE &&
                  t(
                    'calendar:rowJob.header.statuses.' +
                      getNextState(this.props.job.state)
                  )}
              </button>
            </div>
          </div>
        </div>

        <div className='Days'>
          {this.props.days.map((day, index) => {
            let dayClasses = 'Day';
            if (day.getDay() === 1) dayClasses += ' weekStart';
            if (isNonWorkingDay(day)) dayClasses += ' nonWorkDay';

            let contents = {};
            let phaseClass = {};

            phases.forEach((phase) => {
              const dragData = {
                jobId: this.props.job.id,
                phase: phase,
                date: getDateString(day),
              };

              const attributes = {
                'job-id': this.props.job.id,
                phase: phase,
                day: getDateString(day),
              };

              if (phaseDatesToIndex[phase].hasOwnProperty(getDateString(day))) {
                let hasBefore = phaseDatesToIndex[phase].hasOwnProperty(
                  getDateString(new Date(Date.parse(day) - 86400000))
                );
                let hasAfter = phaseDatesToIndex[phase].hasOwnProperty(
                  getDateString(new Date(Date.parse(day) + 86400000))
                );

                phaseClass[phase] =
                  phase.charAt(0).toUpperCase() + phase.slice(1) + ' ';
                if (hasBefore && hasAfter) phaseClass[phase] += 'continuous';
                else if (hasBefore) phaseClass[phase] += 'end';
                else if (hasAfter) phaseClass[phase] += 'start';
                else phaseClass[phase] += 'startEnd';

                const phaseObject = this.props.job.phases[phase][
                  phaseDatesToIndex[phase][getDateString(day)]
                ];
                contents[phase] = (
                  <ContextMenuTrigger
                    test='25'
                    id={'Phase' + ucfirst(phase) + 'Menu'}
                    attributes={attributes}
                    holdToDisplay={-1}
                  >
                    <div
                      className='droppable'
                      onDragOver={(e) => this.onDragOver(e, dragData)}
                      onDragEnter={(e) => this.onDragEnter(e, dragData)}
                      onDragLeave={this.onDragLeave}
                      onDrop={(e) => this.onDrop(e, dragData)}
                    >
                      <div
                        draggable
                        onDragStart={(e) =>
                          this.onDragStart(e, {
                            jobId: this.props.job.id,
                            phase: phase,
                            phaseId: phaseObject.id,
                            date: getDateString(day),
                            maxCapacity: phaseObject.consumption,
                          })
                        }
                      >
                        <div
                          className='classic'
                          key={getDateString(day) + '-classic'}
                        >
                          <span className='classicDay'>{day.getDate()}</span>
                          <span className='classicCapacity'>
                            {phaseObject.consumption}
                          </span>
                        </div>
                        <div
                          className='compact'
                          key={getDateString(day) + '-compact'}
                        />
                      </div>
                    </div>
                  </ContextMenuTrigger>
                );
              } else {
                contents[phase] = (
                  <ContextMenuTrigger
                    id={'EmptyPhaseMenu'}
                    attributes={attributes}
                    holdToDisplay={-1}
                  >
                    <div
                      className='empty droppable'
                      onDragOver={(e) => this.onDragOver(e, dragData)}
                      onDragEnter={(e) => this.onDragEnter(e, dragData)}
                      onDragLeave={this.onDragLeave}
                      onDrop={(e) => this.onDrop(e, dragData)}
                    />
                  </ContextMenuTrigger>
                );
              }
            });

            return (
              <div key={day} className={dayClasses}>
                <div className='Contract'></div>

                <div className={phaseClass['saw']}>{contents['saw']}</div>

                <div className={phaseClass['press']}>{contents['press']}</div>

                <div className={phaseClass['transport']}>
                  {contents['transport']}
                </div>
                <div className={phaseClass['construction']}>
                  {contents['construction']}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const RowJob = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(RowJobComponent)
);

export default RowJob;
