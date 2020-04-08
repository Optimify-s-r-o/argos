import React from 'react';
import TitleBar from '../TitleBar';
import FormRow, {
  FormCardRow,
  FormCardRowHeader,
  FormCardRowContent,
} from '../FormRow';
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
import { Row, TextButton } from '../../styles/global';
import { FormColumn, FormCard, FormCardHeader } from '../../styles/forms';
import styled from 'styled-components';
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
      <Row key='content'>
        <SettingsColumn>
          <FormCard>
            <FormCardHeader>{t('settings:common.header')}</FormCardHeader>

            <PambaRow>
              <FormCardRowHeader>
                {t('settings:common.pambaPath')}
              </FormCardRowHeader>
              <FormCardRowContent>
                <SettingsRow>
                  <PambaPathColumn>
                    <Original>
                      {truncateMiddle(
                        this.state.pambaPathOriginal,
                        30,
                        30,
                        '. . .'
                      )}
                    </Original>
                    {this.state.pambaPath !== this.state.pambaPathOriginal
                      ? [
                          <VerticalArrow>↓</VerticalArrow>,
                          <New>
                            {truncateMiddle(
                              this.state.pambaPath,
                              30,
                              30,
                              '. . .'
                            )}
                          </New>,
                        ]
                      : ''}
                  </PambaPathColumn>
                  <PambaPathColumn>
                    <TextButton onClick={this.openFolderSelection}>
                      {t('settings:common.pambaPathChange')}
                    </TextButton>
                    {this.state.pambaPath !== this.state.pambaPathOriginal ? (
                      <CancelEditingPamba
                        onClick={() => this.revert('pambaPath')}
                      >
                        🞨
                      </CancelEditingPamba>
                    ) : (
                      ''
                    )}
                  </PambaPathColumn>
                </SettingsRow>
              </FormCardRowContent>
            </PambaRow>

            <FormCardHeader>{t('settings:capacities.header')}</FormCardHeader>

            {phases.map((phase) => {
              return (
                <FormRow title={t('settings:capacities.' + phase)}>
                  <SettingsRowCapacity>
                    <OriginalCapacity>
                      {this.state.settings[phase + 'DefaultCapacity']}
                    </OriginalCapacity>
                    {this.state.settingsEdited.hasOwnProperty(
                      phase + 'DefaultCapacity'
                    ) ? (
                      [
                        <HorizontalArrow>→</HorizontalArrow>,
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
                        <CancelEditing
                          onClick={() =>
                            this.cancelEdit(phase + 'DefaultCapacity')
                          }
                        >
                          🞨
                        </CancelEditing>,
                      ]
                    ) : (
                      <TextButton
                        onClick={() => this.edit(phase + 'DefaultCapacity')}
                      >
                        {t('settings:capacities.edit')}
                      </TextButton>
                    )}
                  </SettingsRowCapacity>
                </FormRow>
              );
            })}

            <FormRow border={false}>
              <TextButton
                disabled={!this.state.saveEnabled}
                onClick={this.save}
              >
                {t('settings:save')}
              </TextButton>
            </FormRow>
          </FormCard>
        </SettingsColumn>
      </Row>,
    ];
  }
}

Settings = withTranslation()(Settings);

export { Settings, SettingsPath, SettingsSettings };

const SettingsColumn = styled(FormColumn)`
  width: 600px;
  align-items: stretch;

  ${FormCard} {
    display: flex;
    flex-direction: column;
  }

  ${FormCardRow} {
    display: flex;
    flex-direction: row;

    width: 100%;

    ${FormCardRowHeader} {
      width: 30%;
    }

    ${FormCardRowContent} {
      width: 70%;
    }
  }
`;

const PambaRow = styled(FormCardRow)`
  flex-direction: column !important;

  ${FormCardRowHeader},
  ${FormCardRowContent} {
    width: 100% !important;
  }
`;

const PambaPathColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const SettingsRow = styled.div`
  display: flex;

  flex-direction: row;
  justify-content: flex-end;

  div:first-child {
    flex-grow: 1;
  }

  div:last-child {
    display: flex;

    flex-direction: column;
  }

  ${TextButton} {
    margin: -6px 16px;
  }
`;

const SettingsRowCapacity = styled.div`
  display: flex;

  flex-direction: row;
  justify-content: flex-end;

  ${TextButton} {
    margin: -6px 16px;
  }

  .react-numeric-input {
    position: relative;

    margin: -7px 6px -8px;
  }

  .react-numeric-input input {
    margin: 0;

    width: 76px;
  }
`;

const CancelEditing = styled.button`
  margin: -4px 42px -3px 30px !important;
  padding: 3px 7px 5px 7px;

  background-color: transparent;
  border: 0;
  border-radius: 50%;
  color: #004466;
  cursor: pointer;
  font-weight: 700;

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #004466;
    color: #00bbff;
  }
`;

const CancelEditingPamba = styled(CancelEditing)`
  display: block;

  margin: 0 0 -4px 0 !important;

  width: 27px;
`;

const VerticalArrow = styled.div`
  margin: 4px 0 -4px;
`;

const HorizontalArrow = styled.div`
  margin: 0 4px;
`;

const Original = styled.div`
  color: rgba(0, 0, 0, 0.4);
  min-width: 30px;
`;

const OriginalCapacity = styled(Original)`
  width: 40px;

  text-align: right;
`;

const New = styled.div`
  margin-top: 8px;
`;
