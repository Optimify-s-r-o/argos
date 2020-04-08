import React from 'react';
import { connect } from 'react-redux';
import { isNonWorkingDay } from '../../../../../utils/days';
import { withTranslation } from 'react-i18next';

function getWeekNumber(date) {
  date = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}

const mapStateToProps = (state) => {
  return { days: state.days };
};

class RowDaysComponent extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div id='RowDays' className='Row'>
        <div id='HeaderDays' className='RowHeader'></div>

        <div className='Days'>
          {this.props.days.map((day) => {
            let dayClasses = 'Day';
            if (day.getDay() === 1) dayClasses += ' weekStart';
            if (isNonWorkingDay(day)) dayClasses += ' nonWorkDay';

            let weekNumber = '\u00a0';
            if (day.getDay() === 4)
              weekNumber =
                t('calendar:rowDays.week') + ' ' + getWeekNumber(day);

            return (
              <div key={day} className={dayClasses}>
                <div className='WeekNumber'>{weekNumber}</div>
                <div className='DayInWeek'>
                  {t('calendar:rowDays.days.' + day.getDay())}
                </div>
                <div className='DayInMonth'>{day.getDate()}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const RowDays = withTranslation()(connect(mapStateToProps)(RowDaysComponent));

export default RowDays;
