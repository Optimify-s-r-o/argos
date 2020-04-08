import React from 'react';
import { connect } from 'react-redux';
import { isNonWorkingDay } from '../../../../../utils/days';
//import triangle from '../../../../../icons/triangle.png';
import { withTranslation } from 'react-i18next';

const mapStateToProps = (state) => {
  return { days: state.days };
};

class RowEventsComponent extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div id='RowEvents' className='Row'>
        <div id='HeaderEvents' className='RowHeader'>
          {t('calendar:rowEvents.header')}
        </div>

        <div className='Days'>
          {this.props.days.map((day) => {
            let dayClasses = 'Day';
            if (day.getDay() === 1) dayClasses += ' weekStart';
            if (isNonWorkingDay(day)) dayClasses += ' nonWorkDay';

            return (
              <div key={day} className={dayClasses}>
                {/*<img src={triangle} alt="warning" width="32" height="32"/>*/}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const RowEvents = withTranslation()(
  connect(mapStateToProps)(RowEventsComponent)
);

export default RowEvents;
