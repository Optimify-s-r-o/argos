import React from 'react';
import PropTypes from 'prop-types';
import ReactDateRangePicker from '@wojtekmaj/react-daterange-picker';
import CalendarSelect from './CalendarSelect';
import ReactDOM from "react-dom";
import ReactDatePicker from "./DatePicker";
import {withTranslation} from "react-i18next";

class DateRangePicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isCalendarOpen: false,
            wasCalendarOpen: false,
        };

        this.handleDatesChange = this.handleDatesChange.bind(this);
        this.onFirstCalendarOpen = this.onFirstCalendarOpen.bind(this);
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

    onFirstCalendarOpen() {
        ReactDOM.findDOMNode(this).children[0].querySelector('button').tabIndex = -1;
        ReactDOM.findDOMNode(this).children[1].querySelectorAll('button').forEach(button => button.tabIndex = -1);
    }

    render() {
        const { i18n } = this.props;
        return <ReactDateRangePicker
            name="date"
            clearIcon={null}
            value={this.props.value}
            locale={i18n.language}
            calendarIcon={<CalendarSelect state={this.state.isCalendarOpen ? 'open' : 'closed'}/>}
            onChange={this.handleDatesChange}
            onCalendarOpen={() => {
                if (this.state.wasCalendarOpen === false) {
                    this.onFirstCalendarOpen();
                    this.setState({wasCalendarOpen: true});
                }

                this.setState({isCalendarOpen: true});
            }}
            onCalendarClose={() => this.setState({isCalendarOpen: false})}
        />
    }
}

DateRangePicker.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default withTranslation()(DateRangePicker);