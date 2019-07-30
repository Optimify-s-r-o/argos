import React from 'react'
import { connect } from "react-redux";
import { isNonWorkingDay } from "../../../../../utils/days";

const mapStateToProps = (state, ownProps) => {
    return {
        days: state.days,
        job: state.jobs[ownProps.jobId]
    }
};

const phases = ['saw', 'press', 'transport', 'assembly'];

class RowJobComponent extends React.Component {
    render () {
        return <div className="Row RowJob">
            <div className="RowHeader HeaderJob">
                <div className="JobName">{this.props.job.place}, {this.props.job.type}</div>
                <div className="JobID"><small>ID:</small> {this.props.job.jobId}</div>
                <div className="JobDeadline"><small>Deadline:</small> {this.props.job.deadline}</div>
            </div>

            <div className="Days">
                {
                    this.props.days.map((day, index) => {
                        let dayClasses = "Day";
                        if (day.getDay() === 1)
                            dayClasses += " weekStart";
                        if (isNonWorkingDay(day))
                            dayClasses += " nonWorkDay";


                        let contents = {};
                        let phaseClass = {};
                        phases.forEach(phase => {
                            if (this.props.job.phases[phase].includes(day)) {
                                let hasBefore = this.props.job.phases[phase].includes(this.props.days[index - 1]);
                                let hasAfter = this.props.job.phases[phase].includes(this.props.days[index + 1]);

                                phaseClass[phase] = phase.charAt(0).toUpperCase() + phase.slice(1) + ' ';
                                if (hasBefore && hasAfter)
                                    phaseClass[phase] += 'continuous';
                                else if (hasBefore)
                                    phaseClass[phase] += 'end';
                                else if (hasAfter)
                                    phaseClass[phase] += 'start';
                                else
                                    phaseClass[phase] += 'startEnd';

                                contents[phase] = [
                                    <div className="classic" key={day + '-classic'}>
                                        <span className="classicDay">{day.getDate()}</span>
                                        <span className="classicCapacity"></span>
                                    </div>,
                                    <div className="compact" key={day + '-compact'}></div>
                                ];
                            } else {
                                contents[phase] = <div className="empty"></div>
                            }
                        });

                        return <div key={day} className={dayClasses}>
                            <div className="Deadline"></div>
                            <div className={phaseClass['saw']}>
                                {contents['saw']}
                            </div>
                            <div className={phaseClass['press']}>
                                {contents['press']}
                            </div>
                            <div className={phaseClass['transport']}>
                                {contents['transport']}
                            </div>
                            <div className={phaseClass['assembly']}>
                                {contents['assembly']}
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    }
}

const RowJob = connect(mapStateToProps)(RowJobComponent);

export default RowJob;