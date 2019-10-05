import React from 'react'
import { connect } from 'react-redux';
import { isNonWorkingDay, getDateString } from '../../../../../utils/days';
import { ContextMenuTrigger } from 'react-contextmenu';
import { withTranslation } from 'react-i18next';
import ucfirst from '../../../../../utils/ucfirst';

const mapStateToProps = (state, ownProps) => {
    return {
        days: state.days,
        job: state.jobs[ownProps.jobId]
    }
};

const phases = ['Saw', 'Press', 'Transport', 'Construction'];

class RowJobComponent extends React.Component {
    onDragStart(e, data) { // TODO: change jobId to generated ID in drag & drop
        e.dataTransfer.setData(JSON.stringify(data), '');
        e.dataTransfer.setDragImage(new Image(), 0, 0);
    }

    onDragOver(e, data) { // TODO: change jobId to generated ID in drag & drop
        const draggedData = JSON.parse(e.dataTransfer.types[0]);

        if (draggedData.jobid === data.jobId.toLowerCase() && draggedData.phase === data.phase && draggedData.date !== data.date)
            e.preventDefault();
    }

    onDragEnter(e, data) { // TODO: change jobId to generated ID in drag & drop
        const draggedData = JSON.parse(e.dataTransfer.types[0]);

        if (draggedData.jobid === data.jobId.toLowerCase() && draggedData.phase === data.phase && draggedData.date !== data.date)
            e.target.closest('.droppable').classList.add('dropped');
    }

    onDragLeave(e) {
        e.target.closest('.droppable').classList.remove('dropped');
    }

    onDrop(e, data) { // TODO: change jobId to generated ID in drag & drop
        e.target.closest('.droppable').classList.remove('dropped');

        const draggedData = JSON.parse(e.dataTransfer.types[0]);

        const jobId = data.jobId;
        const phase = data.phase;
        const from = draggedData.date;
        const to = data.date;
        const capacityToMove = draggedData.capacitytomove;

        console.log({
            jobId: jobId,
            phase: phase,
            from: from,
            to: to,
            capacityToMove: capacityToMove,
        })
    }

    render () {
        const { t } = this.props;

        let phaseDatesToIndex = {};
        phases.forEach(phase => {
            phaseDatesToIndex[phase] = {};

            if (this.props.job.Phases && this.props.job.Phases[phase])
                this.props.job.Phases[phase].forEach((entry, index) => {
                    phaseDatesToIndex[phase][entry.Date] = index;
                });
        });

        return <div className="Row RowJob">
            <div className="RowHeader HeaderJob">
                <div className="JobName">{this.props.job.Place}, {this.props.job.Type}</div>
                <div className="JobID"><small>{t('calendar:rowJob.header.jobId')}:</small> {this.props.job.Identification}</div>
                <div className="JobDeadline"><small>{t('calendar:rowJob.header.deadline')}:</small> {this.props.job.Deadline}</div>
                <div className="JobStatus">
                    <small>{t('calendar:rowJob.header.status')}:</small>
                    <div className="status">
                        <button title="Smazat">X</button>
                        <button>Ověřená</button>
                        <button>Dokončená</button>
                    </div>
                </div>
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
                            const dragData = {
                                jobId: this.props.jobId, // TODO: change jobId to generated ID
                                phase: phase,
                                date: getDateString(day),
                            };

                            const attributes ={
                                'job-id': this.props.jobId,
                                'phase': phase,
                                'day': getDateString(day),
                            };

                            if (phaseDatesToIndex[phase].hasOwnProperty(getDateString(day))) {
                                let hasBefore = phaseDatesToIndex[phase].hasOwnProperty(getDateString(this.props.days[index - 1]));
                                let hasAfter = phaseDatesToIndex[phase].hasOwnProperty(getDateString(this.props.days[index + 1]));

                                phaseClass[phase] = phase.charAt(0).toUpperCase() + phase.slice(1) + ' ';
                                if (hasBefore && hasAfter)
                                    phaseClass[phase] += 'continuous';
                                else if (hasBefore)
                                    phaseClass[phase] += 'end';
                                else if (hasAfter)
                                    phaseClass[phase] += 'start';
                                else
                                    phaseClass[phase] += 'startEnd';

                                contents[phase] = <ContextMenuTrigger
                                    test="25"
                                    id={'Phase' + ucfirst(phase) + 'Menu'}
                                    attributes={attributes}
                                    holdToDisplay={-1}>
                                        <div
                                            className="droppable"
                                            onDragOver={e => this.onDragOver(e, dragData)}
                                            onDragEnter={e => this.onDragEnter(e, dragData)}
                                            onDragLeave={this.onDragLeave}
                                            onDrop={e => this.onDrop(e, dragData)}
                                        >
                                            <div
                                                draggable
                                                onDragStart={e => this.onDragStart(e, {
                                                    jobId: this.props.jobId, // TODO: change jobId to generated ID
                                                    phase: phase,
                                                    date: getDateString(day),
                                                    capacityToMove: 100, // TODO
                                                })}
                                            >
                                                <div className="classic" key={getDateString(day) + '-classic'}>
                                                    <span className="classicDay">{day.getDate()}</span>
                                                    <span className="classicCapacity">{this.props.job.Phases[phase][phaseDatesToIndex[phase][getDateString(day)]].Consumption}</span>
                                                </div>
                                                <div className="compact" key={getDateString(day) + '-compact'}/>
                                            </div>
                                        </div>
                                    </ContextMenuTrigger>;
                            } else {
                                contents[phase] = <ContextMenuTrigger
                                    id={'EmptyPhaseMenu'}
                                    attributes={attributes}
                                    holdToDisplay={-1}
                                >
                                    <div
                                        className="empty droppable"
                                        onDragOver={e => this.onDragOver(e, dragData)}
                                        onDragEnter={e => this.onDragEnter(e, dragData)}
                                        onDragLeave={this.onDragLeave}
                                        onDrop={e => this.onDrop(e, dragData)}
                                    />
                                </ContextMenuTrigger>;
                            }
                        });

                        return <div key={day} className={dayClasses}>
                            <div className="Contract"></div>

                            <div className={phaseClass['Saw']}>
                                {contents['Saw']}
                            </div>

                            <div className={phaseClass['Press']}>
                                {contents['Press']}
                            </div>

                            <div className={phaseClass['Transport']}>
                                {contents['Transport']}
                            </div>
                            <div className={phaseClass['Construction']}>
                                {contents['Construction']}
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    }
}

const RowJob = withTranslation()(connect(mapStateToProps)(RowJobComponent));

export default RowJob;