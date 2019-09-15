import React from 'react';
import PropTypes from 'prop-types';
import ReactDateRangePicker from '@wojtekmaj/react-daterange-picker';
import CalendarSelect from './CalendarSelect';

class DateRangePicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isCalendarOpen: false,
        };

        this.handleDatesChange = this.handleDatesChange.bind(this);
    }

    handleDatesChange(dates) {
        let event = {
            target: {
                type: 'date-range',
                name: this.props.name,
                value: dates,
            }
        };

        this.props.onChange(event);
    }

    render() {
        return <ReactDateRangePicker
            name="date"
            clearIcon={null}
            value={this.props.value}
            onChange={this.handleDatesChange}
            onCalendarOpen={() => this.setState({isCalendarOpen: true})}
            onCalendarClose={() => this.setState({isCalendarOpen: false})}
            calendarIcon={<CalendarSelect state={this.state.isCalendarOpen ? 'open' : 'closed'}/>}
        />
    }
}

DateRangePicker.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default DateRangePicker;