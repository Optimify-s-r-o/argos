import React from 'react'
import { connect } from 'react-redux';
import { isNonWorkingDay, getDateString } from '../../../../../utils/days';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { withTranslation } from 'react-i18next';

const mapStateToProps = (state, ownProps) => {
    return {
        days: state.days,
        job: state.jobs[ownProps.jobId]
    }
};

const phases = ['saw', 'press', 'transport', 'assembly'];

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

        return <div className="Row RowJob">
            <div className="RowHeader HeaderJob">
                <div className="JobName">{this.props.job.place}, {this.props.job.type}</div>
                <div className="JobID"><small>{t('calendar:rowJob.header.jobId')}:</small> {this.props.job.jobId}</div>
                <div className="JobDeadline"><small>{t('calendar:rowJob.header.deadline')}:</small> {this.props.job.deadline}</div>
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
                            let dragData = {
                                jobId: this.props.jobId, // TODO: change jobId to generated ID
                                phase: phase,
                                date: getDateString(day),
                            };

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

                                let menuItems = [];

                                if (phase === 'saw' || phase === 'press') {
                                    menuItems.push(<MenuItem key="changeCapacity">{t('calendar:rowJob.phaseContextMenu.changeCapacity')}</MenuItem>);
                                    menuItems.push(<MenuItem key="moveFreeCapacity">{t('calendar:rowJob.phaseContextMenu.moveFreeCapacity')}</MenuItem>);
                                    menuItems.push(<MenuItem key="divider01" divider />);
                                } else if (phase === 'transport') {
                                    menuItems.push(<MenuItem key="changeTransportInfo">{t('calendar:rowJob.phaseContextMenu.changeTransportInfo')}</MenuItem>);
                                    menuItems.push(<MenuItem key="divider01" divider />);
                                }

                                contents[phase] = [
                                    <ContextMenuTrigger key="trigger" id={'contextMenu-' + phase + '-' + day + '-' + this.props.job.jobId} holdToDisplay={-1}>
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
                                                })}>
                                                <div className="classic" key={day + '-classic'}>
                                                    <span className="classicDay">{day.getDate()}</span>
                                                    <span className="classicCapacity">X</span>
                                                </div>
                                                <div className="compact" key={day + '-compact'}/>
                                            </div>
                                        </div>
                                    </ContextMenuTrigger>,
                                    <ContextMenu key="menu" id={'contextMenu-' + phase + '-' + day + '-' + this.props.job.jobId}>
                                        {menuItems}
                                        <MenuItem><span className="danger">{t('calendar:rowJob.phaseContextMenu.removePhase')}</span></MenuItem>
                                    </ContextMenu>
                                ];
                            } else {
                                contents[phase] = [
                                    <ContextMenuTrigger key="trigger" id={'contextMenu-' + phase + '-' + day + '-' + this.props.job.jobId} holdToDisplay={-1}>
                                        <div
                                            className="empty droppable"
                                            onDragOver={e => this.onDragOver(e, dragData)}
                                            onDragEnter={e => this.onDragEnter(e, dragData)}
                                            onDragLeave={this.onDragLeave}
                                            onDrop={e => this.onDrop(e, dragData)}
                                        />
                                    </ContextMenuTrigger>,
                                    <ContextMenu key="menu" id={'contextMenu-' + phase + '-' + day + '-' + this.props.job.jobId}>
                                        <MenuItem>{t('calendar:rowJob.phaseContextMenu.createPhase')}</MenuItem>
                                    </ContextMenu>
                                ];
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

const RowJob = withTranslation()(connect(mapStateToProps)(RowJobComponent));

export default RowJob;