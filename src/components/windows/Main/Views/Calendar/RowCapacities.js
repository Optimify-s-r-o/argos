import React from 'react'
import { connect } from "react-redux";
import { isNonWorkingDay } from "../../../../../utils/days";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { withTranslation } from 'react-i18next';

const mapStateToProps = state => {
    return {
        days: state.days,
        capacitiesView: state.settings.capacitiesView,
        capacities: state.capacities,
    }
};

class RowCapacitiesComponent extends React.Component {
    render () {
        const { t } = this.props;

        return <div id="RowCapacities" className={'Row view-' + this.props.capacitiesView}>
            <div id="HeaderCapacities" className="RowHeader">
                {t('calendar:rowCapacities.header')}
            </div>

            <div className="Days">
                {
                    this.props.days.map((day, key) => {
                        let dayClasses = "Day";
                        if (day.getDay() === 1)
                            dayClasses += " weekStart";
                        if (isNonWorkingDay(day))
                            dayClasses += " nonWorkDay";

                        const capacities = {
                            saw: {
                                absolute: {
                                    used: this.props.capacities[key] ? this.props.capacities[key].Saw.Used : null,
                                    available:this.props.capacities[key] ? this.props.capacities[key].Saw.Available : null,
                                    full: this.props.capacities[key] ? this.props.capacities[key].Saw.Used + this.props.capacities[key].Saw.Available : null,
                                },
                                percentage: this.props.capacities[key] ? 100 - Math.round(this.props.capacities[key].Saw.Used / (this.props.capacities[key].Saw.Used + this.props.capacities[key].Saw.Available) * 100) : null, // TODO: dividing by 0
                            },
                            press: {
                                absolute: {
                                    used: this.props.capacities[key] ? this.props.capacities[key].Press.Used : null,
                                    available:this.props.capacities[key] ? this.props.capacities[key].Press.Available : null,
                                    full: this.props.capacities[key] ? this.props.capacities[key].Press.Used + this.props.capacities[key].Press.Available : null,
                                },
                                percentage: this.props.capacities[key] ? 100 - Math.round(this.props.capacities[key].Press.Used / (this.props.capacities[key].Press.Used + this.props.capacities[key].Press.Available) * 100) : null, // TODO: dividing by 0
                            },
                            construction: {
                                absolute: {
                                    used: this.props.capacities[key] ? this.props.capacities[key].Construction.Used : null,
                                    available:this.props.capacities[key] ? this.props.capacities[key].Construction.Available : null,
                                    full: this.props.capacities[key] ? this.props.capacities[key].Construction.Used + this.props.capacities[key].Construction.Available : null,
                                },
                                percentage: this.props.capacities[key] ? 100 - Math.round(this.props.capacities[key].Construction.Used / (this.props.capacities[key].Construction.Used + this.props.capacities[key].Construction.Available) * 100) : null, // TODO: dividing by 0
                            },
                        };

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
                                    value={capacities.saw.percentage}
                                    text=""
                                    strokeWidth="8"
                                    styles={buildStyles({
                                        strokeLinecap: 'butt',
                                        pathColor: '#ff4040',
                                        trailColor: 'transparent',
                                        pathTransition: 'none',
                                    })}
                                />
                                <div className="capacity-absolute">
                                    <span>{capacities.saw.absolute.available}</span>
                                    <span>{capacities.saw.absolute.full}</span>
                                </div>
                                <div className="capacity-percentage">
                                    <span>{capacities.saw.percentage}</span>
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
                                    value={capacities.press.percentage}
                                    text=""
                                    strokeWidth="8"
                                    styles={buildStyles({
                                        strokeLinecap: 'butt',
                                        pathColor: '#00bbff',
                                        trailColor: 'transparent',
                                        pathTransition: 'none',
                                    })}
                                />
                                <div className="capacity-absolute">
                                    <span>{capacities.press.absolute.available}</span>
                                    <span>{capacities.press.absolute.full}</span>
                                </div>
                                <div className="capacity-percentage">
                                    <span>{capacities.press.percentage}</span>
                                    <span>%</span>
                                </div>
                            </div>
                            <div className="capacity-section capacity-construction">
                                <CircularProgressbar
                                    className="capacity-circle"
                                    value="100"
                                    text=""
                                    strokeWidth="2"
                                    styles={buildStyles({
                                        pathColor: '#ffbc45'
                                    })}
                                />
                                <CircularProgressbar
                                    className="capacity-value"
                                    value={capacities.construction.percentage}
                                    text=""
                                    strokeWidth="8"
                                    styles={buildStyles({
                                        strokeLinecap: 'butt',
                                        pathColor: '#ffbc45',
                                        trailColor: 'transparent',
                                        pathTransition: 'none',
                                    })}
                                />
                                <div className="capacity-absolute">
                                    <span>{capacities.construction.absolute.available}</span>
                                    <span>{capacities.construction.absolute.full}</span>
                                </div>
                                <div className="capacity-percentage">
                                    <span>{capacities.construction.percentage}</span>
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

const RowCapacities = withTranslation()(connect(mapStateToProps)(RowCapacitiesComponent));

export default RowCapacities;