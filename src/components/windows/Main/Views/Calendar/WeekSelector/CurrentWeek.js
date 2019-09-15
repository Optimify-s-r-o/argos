import React from 'react'
import { switchToday } from '../../../../../../actions/days';
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

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
        const { t } = this.props;

        return <div id="CurrentWeek">
            {
                this.props.weekDelta !== 0 &&
                <button className="btn btn-text" onClick={this.handleSwitchToday}>{t('calendar:weekSelector.currentWeek')}</button>
            }
        </div>
    }
}

const CurrentWeek = connect(mapStateToProps, mapDispatchToProps)(CurrentWeekComponent);

export default withTranslation()(CurrentWeek);