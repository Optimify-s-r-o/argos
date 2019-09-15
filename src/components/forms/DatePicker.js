import React from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker from 'react-date-picker';
import CalendarSelect from './CalendarSelect';

class DatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isCalendarOpen: false,
        };

        this.handleDateChange = this.handleDateChange.bind(this);
    }

    handleDateChange(date) {
        let event = {
            target: {
                type: 'date',
                name: this.props.name,
                value: date,
            }
        };

        this.props.onChange(event);
    }

    render() {
        return <ReactDatePicker
            name="date"
            clearIcon={null}
            value={this.props.value}
            onChange={this.handleDateChange}
            onCalendarOpen={() => this.setState({isCalendarOpen: true})}
            onCalendarClose={() => this.setState({isCalendarOpen: false})}
            calendarIcon={<CalendarSelect state={this.state.isCalendarOpen ? 'open' : 'closed'}/>}
        />
    }
}

DatePicker.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default DatePicker;