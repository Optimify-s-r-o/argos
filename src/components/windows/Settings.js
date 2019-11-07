import './Settings.css';
import React from 'react';
import '../../styles/main.css';
import '../../styles/forms.css';
import TitleBar from '../TitleBar';
import FormRow from '../FormRow';
import { withTranslation } from 'react-i18next';
import {getDialog, getIpcRenderer, setCurrentElectronWindowTitle} from '../../utils/electron';
import queryString from 'query-string';

const ipcRenderer = getIpcRenderer();
const dialog = getDialog();

const SettingsPath = '/settings';

const SettingsSettings = {
    width: 503,
    height: 754,
    maximizable: false,
    resizable: false,
};

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pambaPath: '',
            pambaPathOriginal: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.openFolderSelection = this.openFolderSelection.bind(this);
        this.revert = this.revert.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        const params = queryString.parse(this.props.location.search);
        this.setState({
            pambaPath: params.pambaPath,
            pambaPathOriginal: params.pambaPath,
            saveEnabled: false,
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    openFolderSelection() {
        if (dialog) {
            let path = dialog.showOpenDialogSync({
                properties: ['openDirectory']
            })[0];

            this.setState({
                pambaPath: path,
                saveEnabled: path !== this.state.pambaPathOriginal,
            });
        }
    }

    revert(setting) {
        if (this.state.hasOwnProperty(setting) && this.state.hasOwnProperty(setting + 'Original')) {
            let newState = {};
            newState[setting] = this.state[setting + 'Original'];
            this.setState(newState);
        }
    }

    save() {
        if (this.state.pambaPath !== this.state.pambaPathOriginal) {
            ipcRenderer.send('setPambaPath', this.state.pambaPath);
            this.setState({pambaPathOriginal: this.state.pambaPath});
        }

        this.setState({saveEnabled: false})
    }

    render() {
        const { t } = this.props;
        setCurrentElectronWindowTitle(t('settings:title'));
        return [
            <TitleBar key="titleBar" title={t('settings:title')} icon={false}/>,
            <div key="content" className="row">
                <div className="column">
                    <div className="form-card">
                        <div className="form-card-header">
                            {t('settings:common.header')}
                        </div>

                        <FormRow title={t('settings:common.pambaPath')}>
                            <div className="settings-row">
                                <div>
                                    <div className="original padding">{this.state.pambaPathOriginal}</div>
                                    {this.state.pambaPath !== this.state.pambaPathOriginal ? <div className="padding new">{this.state.pambaPath}</div> : ''}
                                </div>
                                <div>
                                    <button className="btn btn-text change-setting" onClick={this.openFolderSelection}>{t('settings:common.pambaPathChange')}</button>
                                    {this.state.pambaPath !== this.state.pambaPathOriginal ? <a onClick={() => this.revert('pambaPath')}>X</a> : ''}
                                </div>
                            </div>
                        </FormRow>

                        <FormRow border={false}>
                            <button disabled={!this.state.saveEnabled} className="btn btn-text" onClick={this.save}>{t('settings:save')}</button>
                        </FormRow>
                    </div>
                </div>
            </div>
        ];
    }
}

Settings = withTranslation()(Settings);

export {Settings, SettingsPath, SettingsSettings};
