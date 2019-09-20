import React from 'react'
import WeekSelector from './Calendar/WeekSelector';
import RowDays from './Calendar/RowDays';
import RowEvents from './Calendar/RowEvents';
import RowCapacities from './Calendar/RowCapacities';
import RowJob from './Calendar/RowJob';
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import jobAddImg from '../../../../icons/add.png';
import {ContextMenu, MenuItem} from "react-contextmenu";

const mapStateToProps = state => {
    return {
        calendarView: state.settings.calendarView,
        jobs: state.jobs
    }
};

class CalendarComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showJobsShadow: false,
        };

        this.handleMouseEnterRowJob = this.handleMouseEnterRowJob.bind(this);
        this.handleMouseLeaveRowJob = this.handleMouseLeaveRowJob.bind(this);
        this.contextMenuChangeCapacity = this.contextMenuChangeCapacity.bind(this);
        this.contextMenuMoveFreeCapacity = this.contextMenuMoveFreeCapacity.bind(this);
        this.contextMenuChangeTransportInfo = this.contextMenuChangeTransportInfo.bind(this);
        this.contextMenuRemovePhase = this.contextMenuRemovePhase.bind(this);
        this.contextMenuCreatePhase = this.contextMenuCreatePhase.bind(this);
    }

    handleMouseEnterRowJob(index) {
        if (index === 0)
            this.setState({showJobsShadow: true});
    }

    handleMouseLeaveRowJob(index) {
        if (index === 0)
            this.setState({showJobsShadow: false});
    }

    getContextMenuTargetData(target) {
        return {
            jobId: target.getAttribute('job-id'),
            phase: target.getAttribute('phase'),
            date: target.getAttribute('day'),
        };
    }

    contextMenuChangeCapacity(e, data, target) {
        const targetData = this.getContextMenuTargetData(target);
        console.log(targetData);
    }

    contextMenuMoveFreeCapacity(e, data, target) {
        const targetData = this.getContextMenuTargetData(target);
        console.log(targetData);
    }

    contextMenuChangeTransportInfo(e, data, target) {
        const targetData = this.getContextMenuTargetData(target);
        console.log(targetData);
    }

    contextMenuRemovePhase(e, data, target) {
        const targetData = this.getContextMenuTargetData(target);
        console.log(targetData);
    }

    contextMenuCreatePhase(e, data, target) {
        const targetData = this.getContextMenuTargetData(target);
        console.log(targetData);
    }

    render () {
        const { t } = this.props;

        return <div id="Calendar">
            <WeekSelector/>
            <RowDays/>
            <RowEvents/>
            <RowCapacities/>
            <div id="Jobs" className={'view' + this.props.calendarView.charAt(0).toUpperCase() + this.props.calendarView.slice(1) + (this.state.showJobsShadow ? ' show-shadow' : '')}>
                {
                    Object.keys(this.props.jobs).map((jobId, index) => {
                        return <div key={'job-' + jobId} onMouseEnter={(e) => this.handleMouseEnterRowJob(index)} onMouseLeave={(e) => this.handleMouseLeaveRowJob(index)}>
                            <RowJob jobId={jobId}/>
                            </div>
                    })
                }

                <div id="RowJobAdd" className="Row">
                    <div id="HeaderAddJob" className="RowHeader">
                        <img src={jobAddImg} alt={t('calendar:addJob')}/>
                        <span>{t('calendar:addJob')}</span>
                    </div>
                </div>

                <ContextMenu id={'PhaseSawMenu'}>
                    <MenuItem onClick={this.contextMenuChangeCapacity}>{t('calendar:rowJob.phaseContextMenu.changeCapacity')}</MenuItem>
                    <MenuItem onClick={this.contextMenuMoveFreeCapacity}>{t('calendar:rowJob.phaseContextMenu.moveFreeCapacity')}</MenuItem>
                    <MenuItem divider />
                    <MenuItem onClick={this.contextMenuRemovePhase}><span className="danger">{t('calendar:rowJob.phaseContextMenu.removePhase')}</span></MenuItem>
                </ContextMenu>

                <ContextMenu id={'PhasePressMenu'}>
                    <MenuItem onClick={this.contextMenuChangeCapacity}>{t('calendar:rowJob.phaseContextMenu.changeCapacity')}</MenuItem>
                    <MenuItem onClick={this.contextMenuMoveFreeCapacity}>{t('calendar:rowJob.phaseContextMenu.moveFreeCapacity')}</MenuItem>
                    <MenuItem divider />
                    <MenuItem onClick={this.contextMenuRemovePhase}><span className="danger">{t('calendar:rowJob.phaseContextMenu.removePhase')}</span></MenuItem>
                </ContextMenu>

                <ContextMenu id={'PhaseTransportMenu'}>
                    <MenuItem onClick={this.contextMenuChangeTransportInfo}>{t('calendar:rowJob.phaseContextMenu.changeTransportInfo')}</MenuItem>
                    <MenuItem divider />
                    <MenuItem onClick={this.contextMenuRemovePhase}><span className="danger">{t('calendar:rowJob.phaseContextMenu.removePhase')}</span></MenuItem>
                </ContextMenu>

                <ContextMenu id={'PhaseAssemblyMenu'}>
                    <MenuItem onClick={this.contextMenuRemovePhase}><span className="danger">{t('calendar:rowJob.phaseContextMenu.removePhase')}</span></MenuItem>
                </ContextMenu>

                <ContextMenu id={'EmptyPhaseMenu'}>
                    <MenuItem onClick={this.contextMenuCreatePhase}>{t('calendar:rowJob.phaseContextMenu.createPhase')}</MenuItem>
                </ContextMenu>
            </div>
        </div>
    }
}

const Calendar = withTranslation()(connect(mapStateToProps)(CalendarComponent));

export default Calendar;