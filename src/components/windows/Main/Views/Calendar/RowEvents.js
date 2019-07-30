import React from 'react'
import { connect } from "react-redux";
import { isNonWorkingDay } from "../../../../../utils/days";
import triangle from '../../../../../icons/triangle.png';

const mapStateToProps = state => {
    return { days: state.days }
};

class RowEventsComponent extends React.Component {
    render () {
        return <div id="RowEvents" className="Row">
            <div id="HeaderEvents" className="RowHeader">
                Události
            </div>

            <div className="Days">
                {
                    this.props.days.map((day) => {
                        let dayClasses = "Day";
                        if (day.getDay() === 1)
                            dayClasses += " weekStart";
                        if (isNonWorkingDay(day))
                            dayClasses += " nonWorkDay";

                        return <div key={day} className={dayClasses}>
                            <img src={triangle} width="32" height="32"/>
                        </div>
                    })
                }
            </div>
        </div>
    }
}

const RowEvents = connect(mapStateToProps)(RowEventsComponent);

export default RowEvents;