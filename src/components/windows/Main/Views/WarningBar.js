import React from 'react';
import './WarningBar.css';

class WarningBar extends React.Component {
  render() {
    if (this.props.visible)
      return (
        <div className='warningBar'>
          {this.props.text}
          {this.props.hasOwnProperty('action') ? this.props.action : ''}
        </div>
      );
    else return null;
  }
}

export default WarningBar;
