import React from 'react'
import WeekSelector from './Calendar/WeekSelector';
import RowDays from './Calendar/RowDays';
import RowEvents from './Calendar/RowEvents';
import RowCapacities from './Calendar/RowCapacities';
import RowJob from './Calendar/RowJob';
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import jobAddImg from '../../../../icons/add.png';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import accountGetToken from '../../../../api/accout-get-token';
import { appAccountTokenSet } from '../../../../actions/app';
import getCalendarDays from '../../../../api/calendar-days';
import { getDateString } from '../../../../utils/days';
import { setCalendarData } from "../../../../actions/calendar";
import {JobAddPath, JobAddSettings} from '../../JobAdd';
import OpenWindow from '../../../OpenWindow';
import {getIpcRenderer, isElectron} from "../../../../utils/electron";

const mapStateToProps = state => {
    return {
        calendarView: state.settings.calendarView,
        days: state.days,
        jobs: state.jobs,
        token: state.token,
    }
};

function mapDispatchToProps(dispatch) {
    return {
        setToken: (token) => dispatch(appAccountTokenSet(token)),
        setCalendarData: (data) => dispatch(setCalendarData(data)),
    }
}

class CalendarComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showJobsShadow: false,
            isLoadingJobs: false,
        };

        this.fetchJobs = this.fetchJobs.bind(this);
        this.handleMouseEnterRowJob = this.handleMouseEnterRowJob.bind(this);
        this.handleMouseLeaveRowJob = this.handleMouseLeaveRowJob.bind(this);
        this.contextMenuChangeCapacity = this.contextMenuChangeCapacity.bind(this);
        this.contextMenuMoveFreeCapacity = this.contextMenuMoveFreeCapacity.bind(this);
        this.contextMenuChangeTransportInfo = this.contextMenuChangeTransportInfo.bind(this);
        this.contextMenuRemovePhase = this.contextMenuRemovePhase.bind(this);
        this.contextMenuCreatePhase = this.contextMenuCreatePhase.bind(this);

        if (isElectron()) {
            const ipcRenderer = getIpcRenderer();

            ipcRenderer.on('event-fired', (e, event, data) => {
                this.fetchJobs();
            });
        }
    }

    componentDidMount() {
        accountGetToken(res => { // TODO: move to login
            if (res.status === 200)
                this.props.setToken(res.body);

            // TODO: rest of this method stays here
            this.fetchJobs();
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.days !== this.props.days)
            this.fetchJobs();
    }

    async fetchJobs() {
        if (this.props.token !== null) {
            this.setState({isLoadingJobs: true});
            await getCalendarDays(
                this.props.token,
                getDateString(this.props.days[0]),
                getDateString(this.props.days[this.props.days.length - 1]),
                res => {
                    console.log(res);
                    if (res.status === 200)
                        this.props.setCalendarData(res.body);
                }
            );
            this.setState({isLoadingJobs: false});
        }
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

        return <div id="Calendar" className={this.state.isLoadingJobs ? 'loading' : ''}>
            <WeekSelector/>
            <RowDays/>
            <RowEvents/>
            <RowCapacities/>
            <div id="Jobs" className={'view' + this.props.calendarView.charAt(0).toUpperCase() + this.props.calendarView.slice(1) + (this.state.showJobsShadow ? ' show-shadow' : '')}>
                {
                    Object.keys(this.props.jobs).map((job, index) => {
                        return <div key={'job-' + job} onMouseEnter={(e) => this.handleMouseEnterRowJob(index)} onMouseLeave={(e) => this.handleMouseLeaveRowJob(index)}>
                            <RowJob jobId={job}/>
                            </div>
                    })
                }

                <div id="RowJobAdd" className="Row">
                    <OpenWindow path={JobAddPath + '?token=' + this.props.token} windowSettings={JobAddSettings}>
                        <div id="HeaderAddJob" className="RowHeader">
                            <img src={jobAddImg} alt={t('calendar:addJob')}/>
                            <span>{t('calendar:addJob')}</span>
                        </div>
                    </OpenWindow>
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

                <ContextMenu id={'PhaseConstructionMenu'}>
                    <MenuItem onClick={this.contextMenuRemovePhase}><span className="danger">{t('calendar:rowJob.phaseContextMenu.removePhase')}</span></MenuItem>
                </ContextMenu>

                <ContextMenu id={'EmptyPhaseMenu'}>
                    <MenuItem onClick={this.contextMenuCreatePhase}>{t('calendar:rowJob.phaseContextMenu.createPhase')}</MenuItem>
                </ContextMenu>
            </div>
        </div>
    }
}

const Calendar = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CalendarComponent));

export default Calendar;