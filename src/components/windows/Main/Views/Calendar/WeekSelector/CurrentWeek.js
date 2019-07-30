import React from 'react'
import { switchToday } from '../../../../../../actions/days';
import { connect } from "react-redux";

const mapStateToProps = state => {
    return { weekDelta: state.weekDelta };
};

function mapDispatchToProps(dispatch) {
    return {
        switchToday: () => dispatch(switchToday())
    }
}

class CurrentWeekComponent extends React.Component {
    constructor() {
        super();

        this.handleSwitchToday = this.handleSwitchToday.bind(this);
    }

    handleSwitchToday() {
        this.props.switchToday();
    }

    render () {
        return <div id="CurrentWeek">
            {
                this.props.weekDelta !== 0 &&
                <button className="btn btn-text" onClick={this.handleSwitchToday}>Aktuální týden</button>
            }
        </div>
    }
}

const CurrentWeek = connect(mapStateToProps, mapDispatchToProps)(CurrentWeekComponent);

export default CurrentWeek;