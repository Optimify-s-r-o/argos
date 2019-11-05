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
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    openFolderSelection() {
        if (dialog) {
            let path = dialog.showOpenDialogSync({
                properties: ['openDirectory']
            })[0];

            ipcRenderer.send('setPambaPath', path);
        }
    }

    render() {
        const { t } = this.props;
        setCurrentElectronWindowTitle(t('settings:title'));
        const params = queryString.parse(this.props.location.search);
        return [
            <TitleBar key="titleBar" title={t('settings:title')} icon={false}/>,
            <div key="content" className="row">
                <div className="column">
                    <div className="form-card">
                        <div className="form-card-header">
                            {t('settings:common.header')}
                        </div>

                        <FormRow title={t('settings:common.pambaPath')}>
                            {params.pambaPath}
                            <button className="btn btn-text" onClick={this.openFolderSelection}>{t('settings:common.pambaPathChange')}</button>
                        </FormRow>

                        <FormRow border={false}>
                            <button className="btn btn-text">{t('settings:save')}</button>
                        </FormRow>
                    </div>
                </div>
            </div>
        ];
    }
}

Settings = withTranslation()(Settings);

export {Settings, SettingsPath, SettingsSettings};
