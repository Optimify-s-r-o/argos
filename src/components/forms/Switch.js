import React from 'react';
import ReactSwitch from 'react-switch';

class Switch extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(checked, event, id) {
    event.target.type = 'checkbox';
    event.target.checked = checked;
    event.target.name = this.props.name;
    this.props.onChange(event);
  }

  render() {
    return (
      <ReactSwitch
        checked={this.props.checked}
        onChange={this.handleInputChange}
        className='react-switch'
        height={31}
        width={64}
        handleDiameter={29}
        offColor='#f2f5f7'
        onColor='#00bbff'
      />
    );
  }
}

export default Switch;
