import React from 'react'
import { connect } from "react-redux";
import { isNonWorkingDay } from "../../../../../utils/days";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const mapStateToProps = state => {
    return {
        days: state.days,
        capacitiesView: state.settings.capacitiesView,
        capacities: state.capacities
    }
};

class RowCapacitiesComponent extends React.Component {
    render () {
        return <div id="RowCapacities" className={'Row view-' + this.props.capacitiesView}>
            <div id="HeaderCapacities" className="RowHeader">
                Zbývající kapacity pracovišť
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
                            <div className="capacity-section capacity-saw">
                                <CircularProgressbar
                                    className="capacity-circle"
                                    value="100"
                                    text=""
                                    strokeWidth="2"
                                    styles={buildStyles({
                                        pathColor: '#ff4040'
                                    })}
                                />
                                <CircularProgressbar
                                    className="capacity-value"
                                    value="60"
                                    text=""
                                    strokeWidth="8"
                                    styles={buildStyles({
                                        strokeLinecap: 'butt',
                                        pathColor: '#ff4040',
                                        trailColor: 'transparent'
                                    })}
                                />
                                <div className="capacity-absolute">
                                    <span>400</span>
                                    <span>800</span>
                                </div>
                                <div className="capacity-percentage">
                                    <span>50</span>
                                    <span>%</span>
                                </div>
                            </div>
                            <div className="capacity-section capacity-press">
                                <CircularProgressbar
                                    className="capacity-circle"
                                    value="100"
                                    text=""
                                    strokeWidth="2"
                                    styles={buildStyles({
                                        pathColor: '#00bbff'
                                    })}
                                />
                                <CircularProgressbar
                                    className="capacity-value"
                                    value="60"
                                    text=""
                                    strokeWidth="8"
                                    styles={buildStyles({
                                        strokeLinecap: 'butt',
                                        pathColor: '#00bbff',
                                        trailColor: 'transparent'
                                    })}
                                />
                                <div className="capacity-absolute">
                                    <span>400</span>
                                    <span>800</span>
                                </div>
                                <div className="capacity-percentage">
                                    <span>60</span>
                                    <span>%</span>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    }
}

const RowCapacities = connect(mapStateToProps)(RowCapacitiesComponent);

export default RowCapacities;