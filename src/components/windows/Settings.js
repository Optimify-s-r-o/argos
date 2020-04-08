import './Settings.css';
import React from 'react';
import '../../styles/main.css';
import '../../styles/forms.css';
import TitleBar from '../TitleBar';
import FormRow from '../FormRow';
import { withTranslation } from 'react-i18next';
import {
  getDialog,
  getIpcRenderer,
  setCurrentElectronWindowTitle,
} from '../../utils/electron';
import queryString from 'query-string';
import getSettings from '../../api/get-settings';
import NumericInput from 'react-numeric-input';
import saveSetting from '../../api/save-setting';
import { showMessageBox } from '../../utils/showMessageBox';
var truncateMiddle = require('truncate-middle');

const ipcRenderer = getIpcRenderer();
const dialog = getDialog();

const SettingsPath = '/settings';

const SettingsSettings = {
  width: 602,
  height: 542,
  maximizable: false,
  resizable: false,
};

const NumericInputStyles = {
  wrap: {
    position: false,
  },
  input: {
    paddingRight: false,
    fontSize: false,
  },
  'input:not(.form-control)': {
    border: false,
    borderRadius: false,
    paddingLeft: false,
    display: false,
    WebkitAppearance: false,
    lineHeight: false,
  },
  btn: {
    background: false,
    boxShadow: false,
  },
  btnUp: {
    borderWidth: 0,
  },
  btnDown: {
    borderWidth: 0,
  },
};

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      saveEnabled: false,
      pambaPath: '',
      pambaPathOriginal: '',
      settings: {},
      settingsEdited: {},
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.numericInputChanged = this.numericInputChanged.bind(this);
    this.openFolderSelection = this.openFolderSelection.bind(this);
    this.revert = this.revert.bind(this);
    this.edit = this.edit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.setSaveStatus = this.setSaveStatus.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    const params = queryString.parse(this.props.location.search);
    this.setState({
      url: params.url,
      token: params.token,
      pambaPath: params.pambaPath,
      pambaPathOriginal: params.pambaPath,
      saveEnabled: false,
    });

    getSettings(params.url, params.token, (data) => {
      this.setState({ settings: data.body });
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      settings: Object.assign(this.state.settings, { [name]: value }),
    });
  }

  numericInputChanged(setting, value) {
    this.setState({
      settingsEdited: Object.assign(this.state.settingsEdited, {
        [setting]: value,
      }),
    });
  }

  openFolderSelection() {
    if (dialog) {
      let path = dialog.showOpenDialogSync({
        properties: ['openDirectory'],
      })[0];

      this.setState({ pambaPath: path }, () => {
        this.setSaveStatus();
      });
    }
  }

  revert(setting) {
    if (
      this.state.hasOwnProperty(setting) &&
      this.state.hasOwnProperty(setting + 'Original')
    ) {
      let newState = {};
      newState[setting] = this.state[setting + 'Original'];
      this.setState(newState, () => {
        this.setSaveStatus();
      });
    }
  }

  edit(setting) {
    if (this.state.settings.hasOwnProperty(setting)) {
      let settingsEdited = this.state.settingsEdited;
      settingsEdited[setting] = this.state.settings[setting];
      this.setState({ settingsEdited: settingsEdited }, () => {
        this.setSaveStatus();
      });
    }
  }

  cancelEdit(setting) {
    if (this.state.settingsEdited.hasOwnProperty(setting)) {
      let settingsEdited = this.state.settingsEdited;
      delete settingsEdited[setting];
      this.setState({ settingsEdited: settingsEdited }, () => {
        this.setSaveStatus();
      });
    }
  }

  setSaveStatus() {
    if (
      this.state.pambaPath !== this.state.pambaPathOriginal ||
      Object.keys(this.state.settingsEdited).length > 0
    )
      this.setState({ saveEnabled: true });
    else this.setState({ saveEnabled: false });
  }

  save() {
    if (this.state.pambaPath !== this.state.pambaPathOriginal) {
      ipcRenderer.send('setPambaPath', this.state.pambaPath);
      this.setState({ pambaPathOriginal: this.state.pambaPath });
    }

    if (Object.keys(this.state.settingsEdited).length > 0) {
      Object.keys(this.state.settingsEdited).map((key) => {
        saveSetting(
          this.state.url,
          this.state.token,
          key,
          this.state.settingsEdited[key],
          (result) => {
            if (result.status === 200) {
              let settings = this.state.settings;
              settings[key] = this.state.settingsEdited[key];

              let settingsEdited = this.state.settingsEdited;
              delete settingsEdited[key];

              this.setState(
                {
                  settings: settings,
                  settingsEdited: settingsEdited,
                },
                () => {
                  this.setSaveStatus();
                }
              );
            }
          }
        );
        return null;
      });
    }

    showMessageBox('settings:saved');
    this.setState({ saveEnabled: false });
  }

  render() {
    const { t } = this.props;
    setCurrentElectronWindowTitle(t('settings:title'));

    const phases = ['saw', 'press', 'construction']; // TODO: change to external constant

    return [
      <TitleBar key='titleBar' title={t('settings:title')} icon={false} />,
      <div key='content' className='row'>
        <div className='column settings-column'>
          <div className='form-card'>
            <div className='form-card-header'>
              {t('settings:common.header')}
            </div>

            <div className='form-card-row pamba-path'>
              <div className='form-card-row-header'>
                {t('settings:common.pambaPath')}
              </div>
              <div className='form-card-row-content'>
                <div className='settings-row'>
                  <div className='pamba-path-column'>
                    <div className='original padding'>
                      {truncateMiddle(
                        this.state.pambaPathOriginal,
                        30,
                        30,
                        '. . .'
                      )}
                    </div>
                    {this.state.pambaPath !== this.state.pambaPathOriginal
                      ? [
                          <div className='settings-vertical-arrow'>↓</div>,
                          <div className='padding new'>
                            {truncateMiddle(
                              this.state.pambaPath,
                              30,
                              30,
                              '. . .'
                            )}
                          </div>,
                        ]
                      : ''}
                  </div>
                  <div className='pamba-path-column'>
                    <button
                      className='btn btn-text change-setting'
                      onClick={this.openFolderSelection}
                    >
                      {t('settings:common.pambaPathChange')}
                    </button>
                    {this.state.pambaPath !== this.state.pambaPathOriginal ? (
                      <button
                        className='cancel-editing no-margin'
                        onClick={() => this.revert('pambaPath')}
                      >
                        🞨
                      </button>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='form-card-header'>
              {t('settings:capacities.header')}
            </div>

            {phases.map((phase) => {
              return (
                <FormRow title={t('settings:capacities.' + phase)}>
                  <div className='settings-row-capacity'>
                    <div className='original capacity'>
                      {this.state.settings[phase + 'DefaultCapacity']}
                    </div>
                    {this.state.settingsEdited.hasOwnProperty(
                      phase + 'DefaultCapacity'
                    ) ? (
                      [
                        <span className='settings-horizontal-arrow'>→</span>,
                        <NumericInput
                          value={
                            this.state.settingsEdited[phase + 'DefaultCapacity']
                          }
                          onChange={(value) => {
                            this.numericInputChanged(
                              phase + 'DefaultCapacity',
                              value
                            );
                          }}
                          min={0}
                          step={1}
                          strict={true}
                          style={NumericInputStyles}
                        />,
                        <button
                          className='cancel-editing'
                          onClick={() =>
                            this.cancelEdit(phase + 'DefaultCapacity')
                          }
                        >
                          🞨
                        </button>,
                      ]
                    ) : (
                      <button
                        className='btn btn-text change-setting'
                        onClick={() => this.edit(phase + 'DefaultCapacity')}
                      >
                        {t('settings:capacities.edit')}
                      </button>
                    )}
                  </div>
                </FormRow>
              );
            })}

            <FormRow border={false}>
              <button
                disabled={!this.state.saveEnabled}
                className='btn btn-text'
                onClick={this.save}
              >
                {t('settings:save')}
              </button>
            </FormRow>
          </div>
        </div>
      </div>,
    ];
  }
}

Settings = withTranslation()(Settings);

export { Settings, SettingsPath, SettingsSettings };
