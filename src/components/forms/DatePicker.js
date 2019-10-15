import React from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker from 'react-date-picker';
import CalendarSelect from './CalendarSelect';
import ReactDOM from 'react-dom';
import {withTranslation} from 'react-i18next';
import ReactDateRangePicker from "./DateRangePicker";

class DatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isCalendarOpen: false,
            wasCalendarOpen: false,
        };

        this.handleDateChange = this.handleDateChange.bind(this);
        this.onFirstCalendarOpen = this.onFirstCalendarOpen.bind(this);
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

    onFirstCalendarOpen() {
        ReactDOM.findDOMNode(this).children[0].querySelector('button').tabIndex = -1;
        ReactDOM.findDOMNode(this).children[1].querySelectorAll('button').forEach(button => button.tabIndex = -1);
    }

    render() {
        const { i18n } = this.props;
        return <ReactDatePicker
            name="date"
            clearIcon={null}
            value={this.props.value}
            locale={i18n.language}
            calendarIcon={<CalendarSelect state={this.state.isCalendarOpen ? 'open' : 'closed'}/>}
            onChange={this.handleDateChange}
            onCalendarOpen={() => {
                if (this.state.wasCalendarOpen === false) {
                    this.onFirstCalendarOpen();
                    this.setState({wasCalendarOpen: true});
                }

                this.setState({isCalendarOpen: true});
            }}
            onCalendarClose={() => this.setState({isCalendarOpen: false})}
        />;
    }
}

DatePicker.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default withTranslation()(DatePicker);