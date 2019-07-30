import React from 'react'
import { connect } from "react-redux";
import { switchForward, switchBackward } from '../../../../../../actions/days';

const mapStateToProps = state => {
    return { days: state.days };
};

function mapDispatchToProps(dispatch) {
    return {
        switchForward: () => dispatch(switchForward()),
        switchBackward: () => dispatch(switchBackward()),
    }
}

class SelectorComponent extends React.Component {
    constructor() {
        super();

        this.state = {
            days: []
        };

        this.handleSwitchForward = this.handleSwitchForward.bind(this);
        this.handleSwitchBackward = this.handleSwitchBackward.bind(this);
    }

    handleSwitchForward() {
        this.props.switchForward();
    }

    handleSwitchBackward() {
        this.props.switchBackward();
    }

    render () {
        return <div id="Selector">
            <button className="btn btn-char" onClick={this.handleSwitchBackward}>&lt;</button>
            <span>{this.props.days[0].toLocaleDateString('cs-CZ')} - {this.props.days[this.props.days.length - 1].toLocaleDateString('cs-CZ')}</span>
            <button className="btn btn-char" onClick={this.handleSwitchForward}>&gt;</button>
        </div>
    }
}

const Selector = connect(mapStateToProps, mapDispatchToProps)(SelectorComponent);

export default Selector;