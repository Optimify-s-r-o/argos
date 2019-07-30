import React from 'react'
import { connect } from "react-redux";
import { isNonWorkingDay } from "../../../../../utils/days";

// TODO: refactor for multilingual support
function getStringForDate(date) {
    let dayOfWeek = date.getDay();
    let strings = [
        "ne",
        "po",
        "út",
        "st",
        "čt",
        "pá",
        "so",
    ];
    return strings[dayOfWeek];
}

function getWeekNumber(date) {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
    let yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    return Math.ceil((((date - yearStart) / 86400000) + 1)/7);
}

const mapStateToProps = state => {
    return { days: state.days }
};

class RowDaysComponent extends React.Component {
    render () {
        return <div id="RowDays" className="Row">
            <div id="HeaderDays" className="RowHeader">
            </div>

            <div className="Days">
                {
                    this.props.days.map(day => {
                        let dayClasses = "Day";
                        if (day.getDay() === 1)
                            dayClasses += " weekStart";
                        if (isNonWorkingDay(day))
                            dayClasses += " nonWorkDay";

                        let weekNumber = "\u00a0";
                        if (day.getDay() === 4)
                            weekNumber = "týden " + getWeekNumber(day);

                        return <div key={day} className={dayClasses}>
                            <div className="WeekNumber">{weekNumber}</div>
                            <div className="DayInWeek">{getStringForDate(day)}</div>
                            <div className="DayInMonth">{day.getDate()}</div>
                        </div>
                    })
                }
            </div>
        </div>
    }
}

const RowDays = connect(mapStateToProps)(RowDaysComponent);

export default RowDays;