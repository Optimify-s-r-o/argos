import React from 'react'
import Calendar from './Views/Calendar';
import { connect } from 'react-redux';
import WarningBar from './Views/WarningBar';
import isConnected from '../../../api/proxy/connected';
import OpenWindow from '../../OpenWindow';
import {SettingsPath, SettingsSettings} from '../Settings';
import {withTranslation} from 'react-i18next';

const mapStateToProps = state => {
    return {
        pambaPath: state.settings.pambaPath,
        view: state.settings.view,
    }
};

class Views extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pambaConnectionWarningVisible: true,
        };
    }

    render () {
        const { t } = this.props;

        // TODO change to event listener (emitter is settings window)
        isConnected(data => {
            const showWarning = !data.body;

            if (this.state.pambaConnectionWarningVisible !== showWarning)
                this.setState({pambaConnectionWarningVisible: showWarning});
        });

        return <div id="Views">
            <WarningBar
                visible={this.state.pambaConnectionWarningVisible}
                text={t('warnings:pambaConnection.text')}
                action={
                    <OpenWindow
                        path={SettingsPath + '?pambaPath=' + this.props.pambaPath}
                        settings={SettingsSettings}
                    >
                        <a>{t('warnings:pambaConnection.action')}</a>.
                    </OpenWindow>
                }
            />
            <div id="View">
                {
                    this.props.view === 'calendar'
                        ? <Calendar/>
                        : ''
                }
            </div>
        </div>
    }
}

export default withTranslation()(connect(mapStateToProps)(Views));