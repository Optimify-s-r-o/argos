import React from 'react';
import { connect } from 'react-redux';
import { isNonWorkingDay } from '../../../../../utils/days';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { withTranslation } from 'react-i18next';

const mapStateToProps = (state) => {
  return {
    days: state.days,
    capacitiesView: state.settings.capacitiesView,
    capacities: state.capacities,
  };
};

class RowCapacitiesComponent extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div
        id='RowCapacities'
        className={'Row view-' + this.props.capacitiesView}
      >
        <div id='HeaderCapacities' className='RowHeader'>
          {t('calendar:rowCapacities.header')}
        </div>

        <div className='Days'>
          {this.props.days.map((day, key) => {
            let dayClasses = 'Day';
            if (day.getDay() === 1) dayClasses += ' weekStart';
            if (isNonWorkingDay(day)) dayClasses += ' nonWorkDay';

            const phases = ['saw', 'press', 'construction'];
            const colors = {
              saw: '#ff4040',
              press: '#00bbff',
              construction: '#ffbc45',
            };

            let capacities = {};

            phases.forEach((phase) => {
              capacities[phase] = {
                absolute: {
                  used: this.props.capacities[key]
                    ? this.props.capacities[key][phase].used
                    : null,
                  available: this.props.capacities[key]
                    ? this.props.capacities[key][phase].available
                    : null,
                  full: this.props.capacities[key]
                    ? this.props.capacities[key][phase].used +
                      this.props.capacities[key][phase].available
                    : null,
                },
                percentage: this.props.capacities[key]
                  ? 100 -
                    Math.round(
                      (this.props.capacities[key][phase].used /
                        (this.props.capacities[key][phase].used +
                          this.props.capacities[key][phase].available)) *
                        100
                    )
                  : null, // TODO: dividing by 0
              };
            });

            return (
              <div key={day} className={dayClasses}>
                {phases.map((phase) => {
                  return (
                    <div className={'capacity-section capacity-' + phase}>
                      <CircularProgressbar
                        className='capacity-circle'
                        value='100'
                        text=''
                        strokeWidth='2'
                        styles={buildStyles({
                          pathColor: colors[phase],
                        })}
                      />
                      <CircularProgressbar
                        className='capacity-value'
                        value={capacities[phase].percentage}
                        text=''
                        strokeWidth='8'
                        styles={buildStyles({
                          strokeLinecap: 'butt',
                          pathColor: colors[phase],
                          trailColor: 'transparent',
                          pathTransition: 'none',
                        })}
                      />
                      <div className='capacity-absolute'>
                        <span>{capacities[phase].absolute.available}</span>
                        <span>{capacities[phase].absolute.full}</span>
                      </div>
                      <div className='capacity-percentage'>
                        <span>{capacities[phase].percentage}</span>
                        <span>%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const RowCapacities = withTranslation()(
  connect(mapStateToProps)(RowCapacitiesComponent)
);

export default RowCapacities;
