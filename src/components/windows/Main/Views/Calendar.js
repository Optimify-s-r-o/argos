import React from 'react'
import WeekSelector from './Calendar/WeekSelector';
import RowDays from './Calendar/RowDays';
import RowEvents from './Calendar/RowEvents';
import RowCapacities from './Calendar/RowCapacities';
import RowJob from './Calendar/RowJob';
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import jobAddImg from '../../../../icons/add.png';

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
    }

    handleMouseEnterRowJob(index) {
        if (index === 0)
            this.setState({showJobsShadow: true});
    }

    handleMouseLeaveRowJob(index) {
        if (index === 0)
            this.setState({showJobsShadow: false});
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
            </div>
        </div>
    }
}

const Calendar = withTranslation()(connect(mapStateToProps)(CalendarComponent));

export default Calendar;