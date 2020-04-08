import React from 'react';
import srcDefault from '../../icons/new/calendar-select-default.png';
import srcHover from '../../icons/new/calendar-select-hover.png';
import srcOpen from '../../icons/new/calendar-select-open.png';

class CalendarSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
    };
  }

  render() {
    return (
      <div
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        {this.props.state === 'open' ? (
          <img src={srcOpen} alt='CalendarSelect' />
        ) : this.state.hover ? (
          <img src={srcHover} alt='CalendarSelect' />
        ) : (
          <img src={srcDefault} alt='CalendarSelect' />
        )}
      </div>
    );
  }
}

export default CalendarSelect;
