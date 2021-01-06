import React from 'react';
import ReactSwitch from 'react-switch';
import styled from 'styled-components';
import { getColorWithOpacity } from '../../styles/theme';

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
      <Wrapper>
        <ReactSwitch
          className='react-switch'
          checked={this.props.checked}
          onChange={this.handleInputChange}
          height={38}
          width={96}
          handleDiameter={30}
          offColor='#fff'
          onColor='#0bf'
          offHandleColor='#0bf'
          onHandleColor='#fff'
          activeBoxShadow='0 1px 8px 0px #046'
          uncheckedIcon={<Label>Ne</Label>}
          checkedIcon={<Label>Ano</Label>}
          tabIndex={this.props.tabIndex}
        />
      </Wrapper>
    );
  }
}

export default Switch;

const Wrapper = styled.div`
  margin: 0.5rem 1rem;

  .react-switch-bg {
    box-shadow: 0 5px 10px -5px ${(props) =>
        getColorWithOpacity(props.theme.colors.primary, 25)} ${(props) => (props.hasError ? ', inset 0 0 0 1px ' + props.theme.colors.danger : '')};
  }
`;

const Label = styled.div`
  line-height: 38px;

  font-weight: 500;
  text-align: center;
  text-transform: uppercase;
`;
