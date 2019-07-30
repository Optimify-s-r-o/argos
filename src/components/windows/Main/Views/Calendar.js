import React from 'react'
import WeekSelector from './Calendar/WeekSelector';
import RowDays from './Calendar/RowDays';
import RowEvents from './Calendar/RowEvents';
import RowCapacities from './Calendar/RowCapacities';
import RowJob from './Calendar/RowJob';
import { connect } from "react-redux";

const mapStateToProps = state => {
    return {
        calendarView: state.settings.calendarView,
        jobs: state.jobs
    }
};

class CalendarComponent extends React.Component {
    render () {
        return <div id="Calendar">
            <WeekSelector/>
            <RowDays/>
            <RowEvents/>
            <RowCapacities/>
            <div id="Jobs" className={'view' + this.props.calendarView.charAt(0).toUpperCase() + this.props.calendarView.slice(1)}>
                {
                    Object.keys(this.props.jobs).map(jobId => {
                        return <RowJob key={'job-' + jobId} jobId={jobId}/>
                    })
                }

                <div id="RowJobAdd" className="Row">
                    <div id="HeaderAddJob" className="RowHeader">
                        Přidat zakázku
                    </div>
                </div>
            </div>
        </div>
    }
}

const Calendar = connect(mapStateToProps)(CalendarComponent);

export default Calendar;